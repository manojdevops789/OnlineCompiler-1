from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from database import SessionLocal, engine, Base
from schemas import SignupModel, LoginModel, ResetPasswordModel, UserResponseModel
from auth import create_user, authenticate_user, get_password_hash
from models import User, PasswordResetToken
from email_utils import send_reset_email
import uuid
import os
from dotenv import load_dotenv
from sqlalchemy import or_

# ✅ Load environment variables
load_dotenv()

# ✅ Create DB tables
Base.metadata.create_all(bind=engine)

# ✅ FastAPI instance
app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Signup
@app.post("/signup", status_code=status.HTTP_201_CREATED, response_model=UserResponseModel)
def signup(user: SignupModel, db: Session = Depends(get_db)):
    if user.password != user.confirmPassword:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")
    return create_user(db, user)

@app.options("/signup")
def options_signup():
    return JSONResponse(content={"status": "ok"})

# ✅ Login
@app.post("/login", response_model=UserResponseModel)
def login(credentials: LoginModel, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials.identifier, credentials.password)
    if user:
        return UserResponseModel(
            id=user.id,
            name=user.name,
            email=user.email,
            mobile=user.mobile
        )
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

# ✅ Reset password request
@app.post("/reset-password-request", status_code=status.HTTP_202_ACCEPTED)
async def reset_password_request(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    identifier = data.get("identifier", "").strip()

    if not identifier:
        raise HTTPException(status_code=400, detail="Identifier (email or mobile) is required")

    if identifier.isdigit() and len(identifier) == 10:
        identifier = "+91" + identifier

    user = db.query(User).filter(
        or_(User.email == identifier, User.mobile == identifier)
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token = str(uuid.uuid4())
    expires_at = datetime.utcnow() + timedelta(minutes=30)
    reset_token = PasswordResetToken(email=user.email, token=token, expires_at=expires_at)
    db.add(reset_token)
    db.commit()

    if "@" in identifier:
        success = send_reset_email(user.email, token)
        medium = "email"
    else:
        success = False  # Future: SMS support
        medium = "SMS"

    if success:
        return {"message": f"Password reset link has been sent to your {medium}."}
    else:
        raise HTTPException(status_code=500, detail=f"Failed to send reset link via {medium}")

# ✅ Reset password using token
@app.post("/reset-password")
def reset_password(payload: ResetPasswordModel, db: Session = Depends(get_db)):
    token_obj = db.query(PasswordResetToken).filter(PasswordResetToken.token == payload.token).first()

    if not token_obj:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid reset token")

    if token_obj.expires_at < datetime.utcnow():
        db.delete(token_obj)
        db.commit()
        raise HTTPException(status_code=status.HTTP_410_GONE, detail="Reset token expired")

    user = db.query(User).filter(User.email == token_obj.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.password = get_password_hash(payload.new_password)
    db.delete(token_obj)
    db.commit()

    return {"message": "Password has been reset successfully"}

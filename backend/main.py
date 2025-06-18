from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from database import SessionLocal, engine, Base
from schemas import SignupModel, LoginModel, ResetPasswordModel
from auth import create_user, authenticate_user, get_password_hash
from models import User, PasswordResetToken
from email_utils import send_reset_email
import uuid
import os
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

# ✅ Create DB tables
Base.metadata.create_all(bind=engine)

# ✅ FastAPI instance
app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
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
@app.post("/signup")
def signup(user: SignupModel, db: Session = Depends(get_db)):
    if user.password != user.confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.mobile == user.mobile).first():
        raise HTTPException(status_code=400, detail="Mobile number already registered")

    create_user(db, user)
    return {"message": "User registered successfully"}

@app.options("/signup")
def options_signup():
    return JSONResponse(content={"status": "ok"})

# ✅ Login
@app.post("/login")
def login(credentials: LoginModel, db: Session = Depends(get_db)):
    if authenticate_user(db, credentials.identifier, credentials.password):
        return {"success": True, "message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

# ✅ Reset password request via email or mobile
@app.post("/reset-password-request")
async def reset_password_request(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    identifier = data.get("identifier", "").strip()

    if not identifier:
        raise HTTPException(status_code=400, detail="Identifier (email or mobile) is required")

    # ✅ Normalize mobile input: if it's 10 digits, convert to +91XXXXXXXXXX
    if identifier.isdigit() and len(identifier) == 10:
        identifier = "+91" + identifier

    from sqlalchemy import or_
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

    # ✅ Send either email or SMS based on identifier
    if "@" in identifier:
        success = send_reset_email(user.email, token)
        medium = "email"
  

    if success:
        return {"message": f"Password reset link has been sent to your {medium}."}
    else:
        raise HTTPException(status_code=500, detail=f"Failed to send reset link via {medium}")

# ✅ Reset password using token
@app.post("/reset-password")
def reset_password(payload: ResetPasswordModel, db: Session = Depends(get_db)):
    token_obj = db.query(PasswordResetToken).filter(PasswordResetToken.token == payload.token).first()

    if not token_obj or token_obj.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == token_obj.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = get_password_hash(payload.new_password)
    db.delete(token_obj)
    db.commit()

    return {"message": "Password has been reset successfully"}

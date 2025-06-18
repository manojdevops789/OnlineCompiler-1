from sqlalchemy.orm import Session
from models import User
from schemas import SignupModel
from passlib.hash import bcrypt
from passlib.context import CryptContext
from fastapi import HTTPException
from sqlalchemy import or_

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ✅ Function to create user with email/mobile check
def create_user(db: Session, user_data: SignupModel):
    # Check if email already exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    # Check if mobile already exists
    if db.query(User).filter(User.mobile == user_data.mobile).first():
        raise HTTPException(
            status_code=400,
            detail="Mobile number already registered."
        )

    # Hash the password before saving
    hashed_password = pwd_context.hash(user_data.password)

    # Create and save new user
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        mobile=user_data.mobile
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ✅ Function to return hashed password (utility)
def get_password_hash(password: str):
    return pwd_context.hash(password)

# ✅ Function to authenticate user during login


from sqlalchemy import or_

def authenticate_user(db: Session, identifier: str, password: str):
    # Login using email or mobile only (both must be unique)
    user = db.query(User).filter(
        or_(User.email == identifier, User.mobile == identifier)
    ).first()

    if user and pwd_context.verify(password, user.password):
        return user
    return None


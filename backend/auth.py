from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status
from passlib.context import CryptContext

from models import User
from schemas import SignupModel, UserResponseModel

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ✅ Create user
def create_user(db: Session, user_data: SignupModel) -> UserResponseModel:
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered."
        )

    if db.query(User).filter(User.mobile == user_data.mobile).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Mobile number already registered."
        )

    hashed_password = pwd_context.hash(user_data.password)

    db_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        mobile=user_data.mobile
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return UserResponseModel(
        id=db_user.id,
        name=db_user.name,
        email=db_user.email,
        mobile=db_user.mobile
    )


# ✅ Password hash utility
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


# ✅ Authenticate user (returns full User)
def authenticate_user(db: Session, identifier: str, password: str) -> User | None:
    user = db.query(User).filter(
        or_(User.email == identifier, User.mobile == identifier)
    ).first()

    if user and pwd_context.verify(password, user.password):
        return user
    return None

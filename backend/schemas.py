from pydantic import BaseModel, EmailStr

# ✅ Signup request schema
class SignupModel(BaseModel):
    name: str
    email: EmailStr
    password: str
    mobile: str
    confirmPassword: str

# ✅ Login request schema
class LoginModel(BaseModel):
    identifier: str  # can be email or mobile
    password: str

# ✅ Password reset schema
class ResetPasswordModel(BaseModel):
    token: str
    new_password: str

# ✅ Safe response schema (used in responses to avoid leaking password)
class UserResponseModel(BaseModel):
    id: int
    name: str
    email: EmailStr
    mobile: str

    class Config:
        orm_mode = True

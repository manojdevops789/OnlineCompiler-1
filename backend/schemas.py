from pydantic import BaseModel, EmailStr

class SignupModel(BaseModel):
    name: str
    email: EmailStr
    password: str
    mobile: str
    confirmPassword: str

class LoginModel(BaseModel):
    identifier: str  # name or email
    password: str

class ResetPasswordModel(BaseModel):
    token: str
    new_password: str
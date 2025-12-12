from pydantic import BaseModel

class Register(BaseModel):
    name: str
    surname: str
    email: str
    date_birth: str
    password: str

class Login(BaseModel):
    email: str
    password: str
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# ✅ Load environment variables from .env file
load_dotenv()

# ✅ Get DB URL from environment or fallback (local dev)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL") or "mysql+mysqlconnector://root:12345@localhost:3306/fastapidb"

# ✅ Create SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# ✅ Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ Base class for models
Base = declarative_base()

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from urllib.parse import quote_plus

load_dotenv()

user = os.getenv("DB_USER")
password = quote_plus(os.getenv("DB_PASSWORD"))
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
name = os.getenv("DB_NAME")

engine = create_engine(f"mysql+pymysql://{user}:{password}@{host}:{port}/{name}")

with engine.connect() as conn:
    result = conn.execute(text("SHOW TABLES"))
    for row in result:
        print(row[0])

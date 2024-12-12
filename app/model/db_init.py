from pymongo import MongoClient
import psycopg2
from redis import Redis
from config import MONGO_URI, POSTGRES_CONFIG, REDIS_CONFIG

# MongoDB 연결
mongo_client = MongoClient(MONGO_URI)
mongo_db = mongo_client["job_database"]

# PostgreSQL 연결
postgres_conn = psycopg2.connect(**POSTGRES_CONFIG)
postgres_cursor = postgres_conn.cursor()

# Redis 연결
redis_client = Redis(**REDIS_CONFIG)

# PostgreSQL 초기화
def init_postgres():
    postgres_cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS jobs (
        job_id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        company VARCHAR(255),
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS applications (
        application_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id),
        job_id INT REFERENCES jobs(job_id),
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    postgres_conn.commit()

# MongoDB 초기화
def init_mongo():
    mongo_db.create_collection("saramin_jobs", validator={
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["title", "job_link", "company", "location"],
            "properties": {
                "title": {"bsonType": "string"},
                "job_link": {"bsonType": "string"},
                "company": {"bsonType": "string"},
                "location": {"bsonType": "string"}
            }
        }
    })

# 초기화 함수 호출
init_postgres()
init_mongo()

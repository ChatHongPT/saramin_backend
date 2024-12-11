# config.py

import os

class Config:
    # MongoDB 연결 정보
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'job_data')

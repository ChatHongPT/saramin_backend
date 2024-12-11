from pymongo import MongoClient, ASCENDING, DESCENDING, TEXT
from flask import current_app

def get_db():
    """데이터베이스 연결 객체 반환"""
    client = MongoClient(current_app.config['MONGODB_URI'])
    return client[current_app.config['DATABASE_NAME']]

def init_indexes(db):
    """필요한 인덱스 초기화"""
    # 회사 컬렉션 인덱스
    db.companies.create_index([("name", ASCENDING)], unique=True)
    db.companies.create_index([("location", ASCENDING)])
    db.companies.create_index([("created_at", DESCENDING)])

    # 채용 공고 컬렉션 인덱스
    db.job_postings.create_index([
        ("company_id", ASCENDING),
        ("title", ASCENDING)
    ], unique=True)

    # 검색을 위한 텍스트 인덱스
    db.job_postings.create_index([
        ("title", TEXT),
        ("description", TEXT),
        ("sector", TEXT),
        ("tasks", TEXT),
        ("requirements", TEXT),
        ("preferred", TEXT),
        ("benefits", TEXT)
    ])

    # 필터링을 위한 다양한 인덱스
    db.job_postings.create_index([("status", ASCENDING)])
    db.job_postings.create_index([("deadline", ASCENDING)])
    db.job_postings.create_index([("location", ASCENDING)])
    db.job_postings.create_index([("job_type", ASCENDING)])
    db.job_postings.create_index([("experience_level", ASCENDING)])
    db.job_postings.create_index([("education", ASCENDING)])
    db.job_postings.create_index([("skills", ASCENDING)])

def init_db():
    """MongoDB 데이터베이스 초기화"""
    db = get_db()
    init_indexes(db)
    return db

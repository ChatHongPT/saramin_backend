#MongoDB Model
from pymongo import MongoClient
from datetime import datetime

# MongoDB 연결 설정
client = MongoClient("mongodb://localhost:27017/")
db = client["job_database"]

# 컬렉션 참조
users_collection = db["users"]
companies_collection = db["companies"]
jobs_collection = db["jobs"]
applications_collection = db["applications"]
bookmarks_collection = db["bookmarks"]
announcements_collection = db["announcements"]
user_activities_collection = db["user_activities"]
job_sectors_collection = db["job_sectors"]

# 사용자 정보 모델
def create_user(username, email, password):
    user = {
        "username": username,
        "email": email,
        "password": password,  # 실제 환경에서는 해싱 필요
        "created_date": datetime.now(),
        "is_active": True
    }
    users_collection.insert_one(user)
    return user

# 회사 정보 모델
def create_company(name, company_link, location, industry, employee_count):
    company = {
        "name": name,
        "company_link": company_link,
        "location": location,
        "industry": industry,
        "employee_count": employee_count,
        "created_date": datetime.now()
    }
    companies_collection.insert_one(company)
    return company

# 채용 공고 모델
def create_job(title, job_link, company_id, location, career, education, employment_type, salary, job_sector):
    job = {
        "title": title,
        "job_link": job_link,
        "company_id": company_id,
        "location": location,
        "career": career,
        "education": education,
        "employment_type": employment_type,
        "salary": salary,
        "job_sector": job_sector,
        "register_date": datetime.now(),
        "scraped_date": datetime.now()
    }
    jobs_collection.insert_one(job)
    return job

# 지원 내역 모델
def create_application(user_id, job_id, status="서류 접수"):
    application = {
        "user_id": user_id,
        "job_id": job_id,
        "applied_date": datetime.now(),
        "status": status
    }
    applications_collection.insert_one(application)
    return application

# 북마크 모델
def create_bookmark(user_id, job_id):
    bookmark = {
        "user_id": user_id,
        "job_id": job_id,
        "created_date": datetime.now()
    }
    bookmarks_collection.insert_one(bookmark)
    return bookmark

# 공지사항 및 이벤트 모델
def create_announcement(title, content, start_date, end_date):
    announcement = {
        "title": title,
        "content": content,
        "start_date": start_date,
        "end_date": end_date,
        "created_date": datetime.now()
    }
    announcements_collection.insert_one(announcement)
    return announcement

# 사용자 활동 기록 모델
def create_user_activity(user_id, activity_type, details):
    activity = {
        "user_id": user_id,
        "activity_type": activity_type,
        "details": details,
        "created_date": datetime.now()
    }
    user_activities_collection.insert_one(activity)
    return activity

# 직무 분야 모델
def create_job_sector(name):
    sector = {"name": name, "created_date": datetime.now()}
    job_sectors_collection.insert_one(sector)
    return sector

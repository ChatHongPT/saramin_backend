from mongodb_models import (
    create_user,
    create_company,
    create_job,
    create_application,
    create_bookmark,
    create_announcement,
    create_user_activity,
    create_job_sector
)
from redis_cache import cache_job, get_cached_job, cache_recent_jobs, get_recent_jobs

# MongoDB 데이터 생성 예시
user = create_user("user1", "user1@example.com", "securepassword")
company = create_company("Company A", "https://company-a.com", "Seoul", "IT", 200)
job = create_job("Backend Developer", "https://joblink.com", company["_id"], "Seoul", "3 years", "Bachelor", "Full-Time", "40M", "IT Development")
application = create_application(user["_id"], job["_id"])
bookmark = create_bookmark(user["_id"], job["_id"])
announcement = create_announcement("New Feature", "We added a new feature!", "2024-12-01", "2024-12-31")
activity = create_user_activity(user["_id"], "VIEW_JOB", {"job_id": job["_id"]})
sector = create_job_sector("Software Development")

# Redis 캐싱 예시
cache_job(job["_id"], job)
cached_job = get_cached_job(job["_id"])
cache_recent_jobs(user["_id"], [job["_id"]])
recent_jobs = get_recent_jobs(user["_id"])

# 출력 예시
print("Created User:", user)
print("Cached Job:", cached_job)
print("Recent Jobs:", recent_jobs)

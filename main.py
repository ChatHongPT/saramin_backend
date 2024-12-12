from app.models.mongodb_models import (
    create_user,
    create_company,
    create_job,
    create_application,
    create_bookmark,
    create_announcement,
    create_user_activity,
    create_job_sector
)
from app.models.redis_cache import cache_job, get_cached_job, cache_recent_jobs, get_recent_jobs
from app.crawlers.saramin_crawler import crawl_saramin

def main():
    # MongoDB 예제 데이터 생성
    print("MongoDB 데이터 생성 중...")
    user = create_user("user1", "user1@example.com", "securepassword")
    company = create_company("Company A", "https://company-a.com", "Seoul", "IT", 200)
    job = create_job("Backend Developer","https://joblink.com",company["_id"],"Seoul","3 years","Bachelor","Full-Time","40M","IT Development")
    application = create_application(user["_id"], job["_id"])
    bookmark = create_bookmark(user["_id"], job["_id"])
    announcement = create_announcement("New Feature", "We added a new feature!", "2024-12-01", "2024-12-31")
    activity = create_user_activity(user["_id"], "VIEW_JOB", {"job_id": job["_id"]})
    sector = create_job_sector("Software Development")
    print("MongoDB 데이터 생성 완료!")

    # Redis 캐싱 테스트
    print("Redis 캐싱 테스트 중...")
    cache_job(str(job["_id"]), job)  # ObjectId를 문자열로 변환하여 전달
    cached_job = get_cached_job(str(job["_id"]))
    print("Cached Job:", cached_job)

    # 크롤러 실행
    print("크롤링 시작...")
    crawl_saramin(pages=3)
    print("크롤링 완료!")

    # 결과 출력
    print("Created User:", user)
    print("Cached Job:", cached_job)
    print("Recent Jobs:", recent_jobs)

if __name__ == "__main__":
    main()

# Redis 캐싱 모델
import redis
import json


# Redis 연결 설정
redis_client = redis.StrictRedis(host="localhost", port=6379, db=0)

# 채용 공고 캐싱
def cache_job(job_id, job_data):
    redis_client.set(f"job:{job_id}", json.dumps(job_data), ex=3600)  # 1시간 TTL 설정

def get_cached_job(job_id):
    job_data = redis_client.get(f"job:{job_id}")
    if job_data:
        return json.loads(job_data)
    return None

# 사용자별 최근 조회 공고 캐싱
def cache_recent_jobs(user_id, job_id_list):
    redis_client.set(f"recent_jobs:{user_id}", json.dumps(job_id_list), ex=86400)  # 1일 TTL

def get_recent_jobs(user_id):
    job_id_list = redis_client.get(f"recent_jobs:{user_id}")
    if job_id_list:
        return json.loads(job_id_list)
    return []

import redis
import json
from bson import ObjectId  # ObjectId 변환에 필요

# Redis 클라이언트 설정
redis_client = redis.StrictRedis(host="localhost", port=6379, db=0)

# ObjectId를 직렬화 가능한 형태로 변환
def serialize_job_data(job_data):
    if "_id" in job_data and isinstance(job_data["_id"], ObjectId):
        job_data["_id"] = str(job_data["_id"])
    return job_data

# 채용 공고 캐싱 함수
def cache_job(job_id, job_data):
    serialized_data = serialize_job_data(job_data)  # 직렬화
    redis_client.set(f"job:{job_id}", json.dumps(serialized_data), ex=3600)  # 1시간 TTL 설정

def get_cached_job(job_id):
    job_data = redis_client.get(f"job:{job_id}")
    if job_data:
        return json.loads(job_data)
    return None

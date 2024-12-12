import redis
import json
from bson import ObjectId  # ObjectId 변환에 필요

# Redis 클라이언트 설정
redis_client = redis.StrictRedis(host="localhost", port=6379, db=0)

# ObjectId를 문자열로 변환하는 함수
def serialize_job_data(job_data):
    """
    MongoDB 데이터에서 ObjectId를 문자열로 변환합니다.
    """
    if "_id" in job_data and isinstance(job_data["_id"], ObjectId):
        job_data["_id"] = str(job_data["_id"])  # ObjectId -> String
    return job_data

# 채용 공고 캐싱 함수
def cache_job(job_id, job_data):
    """
    Redis에 채용 공고 데이터를 캐싱합니다.
    """
    serialized_data = serialize_job_data(job_data)  # ObjectId 변환 적용
    redis_client.set(f"job:{job_id}", json.dumps(serialized_data), ex=3600)  # 1시간 TTL 설정

# 채용 공고 캐싱된 데이터 가져오기
def get_cached_job(job_id):
    """
    Redis에서 캐싱된 채용 공고 데이터를 가져옵니다.
    """
    job_data = redis_client.get(f"job:{job_id}")
    if job_data:
        return json.loads(job_data)
    return None

# 사용자별 최근 조회 공고 캐싱
def cache_recent_jobs(user_id, job_id_list):
    """
    사용자별 최근 조회 공고 ID 리스트를 캐싱합니다.
    """
    redis_client.set(f"recent_jobs:{user_id}", json.dumps(job_id_list), ex=86400)  # 1일 TTL 설정

# 사용자별 최근 조회 공고 가져오기
def get_recent_jobs(user_id):
    """
    Redis에서 사용자별 최근 조회 공고 ID 리스트를 가져옵니다.
    """
    job_id_list = redis_client.get(f"recent_jobs:{user_id}")
    if job_id_list:
        return json.loads(job_id_list)
    return []

import redis
import json
from bson import ObjectId

# Redis 클라이언트 설정
redis_client = redis.StrictRedis(host="localhost", port=6379, db=0)

# ObjectId를 직렬화 가능한 형태로 변환
def serialize_job_data(job_data):
    """
    MongoDB 데이터에서 ObjectId와 datetime 객체를 직렬화 가능한 형태로 변환합니다.
    """
    for key, value in job_data.items():
        if isinstance(value, ObjectId):  # ObjectId는 문자열로 변환
            job_data[key] = str(value)
        elif isinstance(value, datetime):  # datetime은 ISO 문자열로 변환
            job_data[key] = value.isoformat()
    print("Serialized Job Data:", job_data)  # 디버깅용 출력
    return job_data



def cache_job(job_id, job_data):
    """
    Redis에 채용 공고 데이터를 캐싱합니다.
    """
    print("Original Job Data:", job_data)  # 디버깅용 출력
    serialized_data = serialize_job_data(job_data)  # ObjectId 변환 적용
    print("Serialized Data:", serialized_data)  # 디버깅용 출력
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

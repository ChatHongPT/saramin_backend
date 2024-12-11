import redis
import json

# Redis 설정
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def get_from_cache(key):
    """
    Redis에서 데이터를 가져오는 함수.
    """
    data = redis_client.get(key)
    return json.loads(data) if data else None

def set_to_cache(key, value, expiry=3600):
    """
    Redis에 데이터를 저장하는 함수.
    """
    redis_client.setex(key, expiry, json.dumps(value))

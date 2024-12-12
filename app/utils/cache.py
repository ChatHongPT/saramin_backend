from redis import Redis
from config import REDIS_CONFIG

redis_client = Redis(**REDIS_CONFIG)

def get_cached_data(key):
    """Redis에서 데이터 가져오기"""
    data = redis_client.get(key)
    if data:
        return eval(data)
    return None

def set_cached_data(key, value, ttl=3600):
    """Redis에 데이터 저장"""
    redis_client.set(key, str(value), ex=ttl)

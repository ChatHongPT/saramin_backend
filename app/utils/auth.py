from redis import Redis

# Redis connection
redis_client = Redis(host='localhost', port=6379, db=0)

def cache_job(job_id, data, ttl=3600):
    """Cache a job in Redis with a time-to-live (TTL)."""
    redis_client.set(job_id, str(data), ex=ttl)

def get_cached_job(job_id):
    """Retrieve a cached job from Redis."""
    cached_data = redis_client.get(job_id)
    if cached_data:
        return eval(cached_data)
    return None

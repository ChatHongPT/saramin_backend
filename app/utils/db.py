import pymongo

# MongoDB 설정
MONGO_URI = "mongodb://localhost:27017"
DATABASE_NAME = "job_db"
COLLECTION_LOCATIONS = "locations"
COLLECTION_TAGS = "tags"
COLLECTION_JOBS = "jobs"

def get_db_connection():
    """
    MongoDB 데이터베이스 연결을 생성하는 함수.

    Returns:
        client: pymongo.MongoClient 객체
    """
    client = pymongo.MongoClient(MONGO_URI)
    print("MongoDB connection established.")
    return client

def load_locations_to_memory():
    """
    Locations 데이터를 메모리로 로드하는 함수.

    Returns:
        dict: 지역 데이터를 (region, district) 키와 id 값으로 반환.
    """
    client = get_db_connection()
    db = client[DATABASE_NAME]
    locations_collection = db[COLLECTION_LOCATIONS]
    locations = {
        (doc["region"], doc["district"]): doc["_id"] for doc in locations_collection.find()
    }
    client.close()
    return locations

def load_tags_to_memory():
    """
    Tags 데이터를 메모리로 로드하는 함수.

    Returns:
        dict: 태그 데이터를 이름 키와 id 값으로 반환.
    """
    client = get_db_connection()
    db = client[DATABASE_NAME]
    tags_collection = db[COLLECTION_TAGS]
    tags = {doc["name"]: doc["_id"] for doc in tags_collection.find()}
    client.close()
    return tags

def save_jobs_to_db(jobs):
    """
    크롤링된 Job 데이터를 MongoDB에 저장하는 함수.

    Args:
        jobs (list): 크롤링된 Job 데이터 리스트.
    """
    client = get_db_connection()
    db = client[DATABASE_NAME]
    jobs_collection = db[COLLECTION_JOBS]

    for job in jobs:
        try:
            # 중복 데이터 방지: title과 company를 기준으로 확인
            if not jobs_collection.find_one({"title": job["title"], "company": job["company"]}):
                jobs_collection.insert_one(job)
                print(f"저장 성공: {job['title']} - {job['company']}")
            else:
                print(f"중복 데이터: {job['title']} - {job['company']}")
        except pymongo.errors.PyMongoError as e:
            print(f"MongoDB 저장 에러: {e}")

    client.close()
    print("Jobs saved to MongoDB.")

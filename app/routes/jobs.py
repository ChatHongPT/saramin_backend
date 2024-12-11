from flask import Blueprint, request, jsonify
from pymongo import DESCENDING
from app.utils.db import get_db_connection
from app.utils.cache import get_from_cache, set_to_cache
from bson.objectid import ObjectId

# Blueprint 설정
jobs_bp = Blueprint('jobs', __name__)

# MongoDB 설정
client = get_db_connection()
db = client["job_db"]
jobs_collection = db["jobs"]

@jobs_bp.route('/jobs', methods=['GET'])
def get_jobs():
    """
    공고 목록 조회 API (GET /jobs)
    """
    page = int(request.args.get('page', 1))
    page_size = 20
    cache_key = f"jobs_page_{page}"  # Redis 캐시 키
    filters = {}
    sort = request.args.get('sort', 'created_at')
    order = DESCENDING if request.args.get('order', 'desc') == 'desc' else 1

    # 필터링
    region = request.args.get('region')
    career = request.args.get('career')
    salary = request.args.get('salary')
    stack = request.args.get('stack')

    if region:
        filters['location'] = region
    if career:
        filters['career'] = career
    if salary:
        filters['salary'] = {'$gte': int(salary)}
    if stack:
        filters['job_sector'] = {'$regex': stack, '$options': 'i'}

    # Redis 캐시 확인
    cached_jobs = get_from_cache(cache_key)
    if cached_jobs:
        return jsonify(cached_jobs), 200

    # 페이지네이션
    skip = (page - 1) * page_size

    # MongoDB 데이터 조회
    jobs = jobs_collection.find(filters).sort(sort, order).skip(skip).limit(page_size)
    result = [
        {
            "id": str(job["_id"]),
            "title": job["title"],
            "company": job["company"],
            "location": job["location"],
            "career": job["career"],
            "salary": job.get("salary", "정보 없음"),
            "job_sector": job["job_sector"]
        }
        for job in jobs
    ]

    # Redis에 캐싱
    set_to_cache(cache_key, result)

    return jsonify(result), 200

@jobs_bp.route('/jobs/search', methods=['GET'])
def search_jobs():
    """
    공고 검색 API (GET /jobs/search)
    """
    keyword = request.args.get('keyword', '')
    company = request.args.get('company', '')
    position = request.args.get('position', '')
    cache_key = f"jobs_search_{keyword}_{company}_{position}"  # Redis 캐시 키

    # Redis 캐시 확인
    cached_jobs = get_from_cache(cache_key)
    if cached_jobs:
        return jsonify(cached_jobs), 200

    filters = {
        "$or": []
    }

    if keyword:
        filters["$or"].append({"title": {"$regex": keyword, "$options": "i"}})
    if company:
        filters["$or"].append({"company": {"$regex": company, "$options": "i"}})
    if position:
        filters["$or"].append({"job_sector": {"$regex": position, "$options": "i"}})

    if not filters["$or"]:
        filters.pop("$or")

    jobs = jobs_collection.find(filters).limit(20)
    result = [
        {
            "id": str(job["_id"]),
            "title": job["title"],
            "company": job["company"],
            "location": job["location"],
            "career": job["career"],
            "salary": job.get("salary", "정보 없음"),
            "job_sector": job["job_sector"]
        }
        for job in jobs
    ]

    # Redis에 캐싱
    set_to_cache(cache_key, result)

    return jsonify(result), 200

@jobs_bp.route('/jobs/<string:job_id>', methods=['GET'])
def get_job_detail(job_id):
    """
    공고 상세 조회 API (GET /jobs/:id)
    """
    cache_key = f"job_{job_id}"  # Redis 캐시 키

    # Redis 캐시 확인
    cached_job = get_from_cache(cache_key)
    if cached_job:
        return jsonify(cached_job), 200

    # MongoDB에서 데이터 조회
    job = jobs_collection.find_one({"_id": ObjectId(job_id)})

    if not job:
        return jsonify({"error": "공고를 찾을 수 없습니다."}), 404

    # 조회수 증가
    jobs_collection.update_one({"_id": ObjectId(job_id)}, {"$inc": {"views": 1}})

    # 관련 공고 추천 (같은 job_sector 기준)
    related_jobs = jobs_collection.find({
        "job_sector": job["job_sector"],
        "_id": {"$ne": ObjectId(job_id)}
    }).limit(5)

    related_result = [
        {
            "id": str(r_job["_id"]),
            "title": r_job["title"],
            "company": r_job["company"]
        }
        for r_job in related_jobs
    ]

    result = {
        "id": str(job["_id"]),
        "title": job["title"],
        "company": job["company"],
        "location": job["location"],
        "career": job["career"],
        "salary": job.get("salary", "정보 없음"),
        "job_sector": job["job_sector"],
        "views": job.get("views", 0),
        "related_jobs": related_result
    }

    # Redis에 캐싱
    set_to_cache(cache_key, result)

    return jsonify(result), 200

@jobs_bp.route('/jobs', methods=['POST'])
def create_job():
    """
    공고 등록 API (POST /jobs)
    """
    data = request.json

    required_fields = ["title", "company", "location", "career", "job_sector"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "필수 필드가 누락되었습니다."}), 400

    job = {
        "title": data["title"],
        "company": data["company"],
        "location": data["location"],
        "career": data["career"],
        "salary": data.get("salary", "정보 없음"),
        "job_sector": data["job_sector"],
        "created_at": data.get("created_at", "정보 없음"),
        "views": 0
    }

    result = jobs_collection.insert_one(job)
    return jsonify({"message": "공고가 등록되었습니다.", "id": str(result.inserted_id)}), 201

@jobs_bp.route('/jobs/<string:job_id>', methods=['PUT'])
def update_job(job_id):
    """
    공고 수정 API (PUT /jobs/:id)
    """
    data = request.json

    job = jobs_collection.find_one({"_id": ObjectId(job_id)})
    if not job:
        return jsonify({"error": "공고를 찾을 수 없습니다."}), 404

    updated_data = {key: data[key] for key in data if key in job}
    jobs_collection.update_one({"_id": ObjectId(job_id)}, {"$set": updated_data})

    return jsonify({"message": "공고가 수정되었습니다."}), 200

@jobs_bp.route('/jobs/<string:job_id>', methods=['DELETE'])
def delete_job(job_id):
    """
    공고 삭제 API (DELETE /jobs/:id)
    """
    result = jobs_collection.delete_one({"_id": ObjectId(job_id)})

    if result.deleted_count == 0:
        return jsonify({"error": "공고를 찾을 수 없습니다."}), 404

    # Redis 캐시 무효화
    cache_key = f"job_{job_id}"
    set_to_cache(cache_key, None)

    return jsonify({"message": "공고가 삭제되었습니다."}), 200

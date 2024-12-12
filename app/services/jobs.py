from flask import Blueprint, jsonify
from pymongo import MongoClient
from utils.cache import get_cached_data, set_cached_data

mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client["job_database"]
mongo_collection = mongo_db["saramin_jobs"]

jobs_bp = Blueprint("jobs", __name__)

@jobs_bp.route("/jobs", methods=["GET"])
def get_jobs():
    cached_jobs = get_cached_data("jobs")
    if cached_jobs:
        return jsonify({"data": cached_jobs, "cached": True})
    
    jobs = list(mongo_collection.find({}, {"_id": 0}))
    set_cached_data("jobs", jobs)
    return jsonify({"data": jobs, "cached": False})

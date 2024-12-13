from flask import Blueprint, jsonify
from .models import get_jobs

job_routes = Blueprint('job_routes', __name__)

@job_routes.route('/jobs', methods=['GET'])
def get_all_jobs():
    jobs = get_jobs()
    return jsonify(jobs), 200

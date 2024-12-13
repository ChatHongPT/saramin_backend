from flask import Blueprint
from controllers.job_controller import get_jobs, get_job

job_bp = Blueprint('job', __name__)

# 모든 채용공고 가져오기
job_bp.add_url_rule('/all', 'get_all_jobs', get_jobs, methods=['GET'])

# 채용공고 ID로 가져오기
job_bp.add_url_rule('/<job_id>', 'get_job_by_id', get_job, methods=['GET'])

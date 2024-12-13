from flask_pymongo import PyMongo
from datetime import datetime

mongo = PyMongo()

def init_db(app):
    mongo.init_app(app)
    
def create_job(data):
    # MongoDB collection to save job data
    job_collection = mongo.db.saramin_jobs
    job_collection.insert_one(data)

def get_jobs():
    # Fetch all jobs from the MongoDB collection
    job_collection = mongo.db.saramin_jobs
    return list(job_collection.find())

def get_job_by_link(job_link):
    # Find a job by its link (used for deduplication)
    job_collection = mongo.db.saramin_jobs
    return job_collection.find_one({'job_link': job_link})

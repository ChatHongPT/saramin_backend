from models.job_model import get_job_collection

def get_all_jobs():
    collection = get_job_collection()
    return list(collection.find({}))

def get_job_by_id(job_id):
    collection = get_job_collection()
    return collection.find_one({"_id": job_id})

from flask import Flask
from flask_swagger_ui import get_swaggerui_blueprint
from app.Crawling.crawler import run_crawler
from app.utils.db import MongoDBManager

app = Flask(__name__)

# Swagger 설정
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.yaml'
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={'app_name': "WSD Assignment API"}
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

@app.route('/api/crawl', methods=['POST'])
def crawl_jobs():
    """크롤링 실행 및 MongoDB 저장"""
    count = run_crawler(pages=5)
    return {"message": f"{count}개의 공고가 저장되었습니다."}, 200

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    """MongoDB에서 채용 공고 조회"""
    mongo = MongoDBManager()
    jobs = list(mongo.db["JobPostings"].find({}, {"_id": 0}))
    mongo.close()
    return {"jobs": jobs}, 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

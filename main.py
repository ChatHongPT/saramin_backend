from flask import Flask
from flask_swagger_ui import get_swaggerui_blueprint
from app.utils.db import MongoDBManager
from app.Crawling.crawler import crawl_saramin

app = Flask(__name__)

# Swagger 설정
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.yaml'
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={'app_name': "WSD-Assignment-03"}
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

@app.route("/api/jobs", methods=["GET"])
def get_jobs():
    """MongoDB에서 채용 공고 가져오기"""
    mongo = MongoDBManager()
    jobs = list(mongo.db["JobPostings"].find({}, {"_id": 0}))
    mongo.close()
    return {"jobs": jobs}, 200

@app.route("/api/crawl", methods=["POST"])
def run_crawler():
    """크롤링 실행 및 MongoDB 저장"""
    df = crawl_saramin(pages=5)
    mongo = MongoDBManager()
    collection = mongo.db["JobPostings"]
    for _, row in df.iterrows():
        try:
            collection.insert_one(row.to_dict())
        except Exception as e:
            print(f"삽입 실패: {e}")
    mongo.close()
    return {"message": f"{len(df)}개의 데이터 크롤링 및 저장 완료"}, 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

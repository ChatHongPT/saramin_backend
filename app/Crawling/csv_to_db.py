import pandas as pd
from pymongo import MongoClient
import os

# MongoDB 설정
MONGO_URI = "mongodb://localhost:27017"
DATABASE_NAME = "job_db"
COLLECTION_NAME = "job_posts"

# CSV 파일 경로 설정
DATA_DIR = "data"
INPUT_FILE = os.path.join(DATA_DIR, "saramin.csv")

def connect_to_db():
    """
    MongoDB 연결 설정
    """
    client = MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    return db[COLLECTION_NAME]

def save_csv_to_db():
    """
    CSV 데이터를 읽어 MongoDB에 저장
    """
    if not os.path.exists(INPUT_FILE):
        print(f"CSV 파일을 찾을 수 없습니다: {INPUT_FILE}")
        return

    collection = connect_to_db()

    # CSV 데이터 읽기
    df = pd.read_csv(INPUT_FILE, encoding="utf-8-sig")
    print(f"{len(df)}개의 데이터를 MongoDB에 저장합니다...")

    for _, row in df.iterrows():
        job_data = {
            "title": row["채용 제목"],
            "job_link": row["채용 링크"],
            "company": row["회사명"],
            "location": row["지역"],
            "career": row["경력"],
            "education": row["학력"],
            "employment_type": row["고용형태"],
            "salary": row["연봉"],
            "job_sector": row["직무 분야"],
            "register_date": row["등록일"],
            "deadline": row["마감일"]
        }

        # 중복 데이터 방지
        if not collection.find_one({"title": job_data["title"], "company": job_data["company"]}):
            collection.insert_one(job_data)
            print(f"저장 성공: {job_data['title']} - {job_data['company']}")
        else:
            print(f"중복 데이터: {job_data['title']} - {job_data['company']}")

def main():
    save_csv_to_db()

if __name__ == "__main__":
    main()

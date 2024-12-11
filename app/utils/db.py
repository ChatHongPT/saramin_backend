from pymongo import MongoClient, ASCENDING, DESCENDING

# MongoDB 연결 설정
MONGO_URI = "mongodb://localhost:27017"
DATABASE_NAME = "job_db"

class Database:
    def __init__(self):
        self.client = MongoClient(MONGO_URI)
        self.db = self.client[DATABASE_NAME]

    def initialize_collections(self):
        """
        데이터베이스의 기본 컬렉션과 인덱스 초기화
        """
        self.create_jobs_collection()
        self.create_companies_collection()
        self.create_users_collection()
        self.create_applications_collection()
        self.create_bookmarks_collection()

    def create_jobs_collection(self):
        """
        채용 공고 컬렉션 생성 및 인덱스 설정
        """
        collection = self.db["jobs"]
        collection.create_index([("title", ASCENDING), ("company_id", ASCENDING)], unique=True)
        collection.create_index("location", ASCENDING)
        collection.create_index("job_sector", ASCENDING)
        print("Jobs collection initialized.")

    def create_companies_collection(self):
        """
        회사 정보 컬렉션 생성 및 인덱스 설정
        """
        collection = self.db["companies"]
        collection.create_index("name", unique=True)
        collection.create_index("industry", ASCENDING)
        print("Companies collection initialized.")

    def create_users_collection(self):
        """
        사용자 정보 컬렉션 생성 및 인덱스 설정
        """
        collection = self.db["users"]
        collection.create_index("email", unique=True)
        collection.create_index("username", unique=True)
        print("Users collection initialized.")

    def create_applications_collection(self):
        """
        지원 내역 컬렉션 생성 및 인덱스 설정
        """
        collection = self.db["applications"]
        collection.create_index([("user_id", ASCENDING), ("job_id", ASCENDING)], unique=True)
        collection.create_index("status", ASCENDING)
        print("Applications collection initialized.")

    def create_bookmarks_collection(self):
        """
        북마크/관심공고 컬렉션 생성 및 인덱스 설정
        """
        collection = self.db["bookmarks"]
        collection.create_index([("user_id", ASCENDING), ("job_id", ASCENDING)], unique=True)
        print("Bookmarks collection initialized.")

# 데이터 모델 생성
class JobModel:
    def __init__(self, db):
        self.collection = db["jobs"]

    def insert_job(self, job_data):
        """
        채용 공고 삽입
        """
        try:
            self.collection.insert_one(job_data)
            print("Job inserted successfully.")
        except Exception as e:
            print(f"Error inserting job: {e}")

class CompanyModel:
    def __init__(self, db):
        self.collection = db["companies"]

    def insert_company(self, company_data):
        """
        회사 정보 삽입
        """
        try:
            self.collection.insert_one(company_data)
            print("Company inserted successfully.")
        except Exception as e:
            print(f"Error inserting company: {e}")

class UserModel:
    def __init__(self, db):
        self.collection = db["users"]

    def insert_user(self, user_data):
        """
        사용자 정보 삽입
        """
        try:
            self.collection.insert_one(user_data)
            print("User inserted successfully.")
        except Exception as e:
            print(f"Error inserting user: {e}")

class ApplicationModel:
    def __init__(self, db):
        self.collection = db["applications"]

    def insert_application(self, application_data):
        """
        지원 내역 삽입
        """
        try:
            self.collection.insert_one(application_data)
            print("Application inserted successfully.")
        except Exception as e:
            print(f"Error inserting application: {e}")

class BookmarkModel:
    def __init__(self, db):
        self.collection = db["bookmarks"]

    def insert_bookmark(self, bookmark_data):
        """
        북마크 정보 삽입
        """
        try:
            self.collection.insert_one(bookmark_data)
            print("Bookmark inserted successfully.")
        except Exception as e:
            print(f"Error inserting bookmark: {e}")

if __name__ == "__main__":
    db = Database()
    db.initialize_collections()

    # 예시 데이터 삽입
    job_model = JobModel(db.db)
    job_model.insert_job({"title": "Software Engineer", "company_id": "1", "location": "Seoul", "job_sector": "IT"})

    company_model = CompanyModel(db.db)
    company_model.insert_company({"name": "Tech Corp", "industry": "IT"})

    user_model = UserModel(db.db)
    user_model.insert_user({"email": "user@example.com", "username": "test_user"})

    application_model = ApplicationModel(db.db)
    application_model.insert_application({"user_id": "1", "job_id": "1", "status": "applied"})

    bookmark_model = BookmarkModel(db.db)
    bookmark_model.insert_bookmark({"user_id": "1", "job_id": "1"})

# running_craw.py
from pymongo import MongoClient
from crawler.crawler import SaraminCrawler
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    try:
        # MongoDB 연결 (직접 URI와 데이터베이스 이름 설정)
        client = MongoClient('mongodb://localhost:27017')  # MongoDB URI
        db = client['job_portal']  # 데이터베이스 이름
        
        # SaraminCrawler 초기화 및 실행
        crawler = SaraminCrawler(db)
        total_jobs = crawler.crawl(max_pages=5)  # 최대 5페이지까지 크롤링
        
        # 데이터베이스 내 채용공고 및 회사 수 확인
        jobs_count = db.job_postings.count_documents({})
        companies_count = db.companies.count_documents({})
        
        logger.info(f"크롤링 완료. 총 수집된 채용공고: {total_jobs}")
        logger.info(f"데이터베이스 내 총 채용공고 수: {jobs_count}")
        logger.info(f"데이터베이스 내 총 회사 수: {companies_count}")

    except Exception as e:
        logger.error(f"실행 중 오류 발생: {str(e)}")
    finally:
        if 'client' in locals():
            client.close()  # MongoDB 연결 종료

if __name__ == "__main__":
    main()

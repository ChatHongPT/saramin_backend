import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from datetime import datetime, timedelta
import time

# MongoDB 연결
client = MongoClient('mongodb://localhost:27017/')
db = client['job_database']  # 데이터베이스 이름
collection = db['saramin_jobs']  # 컬렉션 이름


def crawl_saramin(pages=1):
    """
    사람인 채용공고를 크롤링하여 MongoDB에 저장하는 함수

    Args:
        pages (int): 크롤링할 페이지 수
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Whale/3.28.266.14 Safari/537.36'
    }

    for page in range(1, pages + 1):
        url = f"https://www.saramin.co.kr/zf_user/search?search_area=main&search_done=y&search_optional_item=n&loc_mcd=101000%2C102000&cat_mcls=2&recruitPage={page}&recruitSort=relation&recruitPageCount=40"

        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            # 채용공고 목록 가져오기
            job_listings = soup.select('div.item_recruit')

            for job in job_listings:
                try:
                    title_tag = job.select_one('h2.job_tit a')
                    title = title_tag.text.strip() if title_tag else '정보 없음'
                    job_link = 'https://www.saramin.co.kr' + title_tag['href'] if title_tag else None

                    # 회사명 및 링크
                    company_tag = job.select_one('strong.corp_name a')
                    company = company_tag.text.strip() if company_tag else '정보 없음'
                    company_link = 'https://www.saramin.co.kr' + company_tag['href'] if company_tag else None

                    # 채용 조건
                    conditions = job.select('div.job_condition span')
                    location = conditions[0].text.strip() if len(conditions) > 0 else '정보 없음'
                    career = conditions[1].text.strip() if len(conditions) > 1 else '정보 없음'
                    education = conditions[2].text.strip() if len(conditions) > 2 else '정보 없음'
                    employment_type = conditions[3].text.strip() if len(conditions) > 3 else '정보 없음'
                    salary = conditions[4].text.strip() if len(conditions) > 4 else '정보 없음'

                    # 직무 분야
                    sectors = job.select('div.job_sector a')
                    sector_list = [sector.text.strip() for sector in sectors]
                    job_sector = ', '.join(sector_list) if sector_list else '정보 없음'

                    # 등록일
                    register_date_tag = job.select_one('span.job_day')
                    register_date = register_date_tag.text.strip() if register_date_tag else '정보 없음'
                    if '등록일' in register_date or '수정일' in register_date:
                        register_date = register_date.replace('등록일 ', '').replace('수정일 ', '')
                        register_date = f"20{register_date}"

                    # 마감일
                    deadline_tag = job.select_one('span.date')
                    deadline = deadline_tag.text.strip() if deadline_tag else '정보 없음'
                    if '내일마감' in deadline:
                        deadline = (datetime.now() + timedelta(days=1)).strftime('%Y/%m/%d')
                    elif '오늘마감' in deadline:
                        deadline = datetime.now().strftime('%Y/%m/%d')
                    elif '상시채용' in deadline:
                        deadline = '상시채용'
                    elif '채용시' in deadline:
                        deadline = '채용시'
                    else:
                        try:
                            deadline = deadline.replace('~ ', '').split('(')[0].strip()
                            deadline = datetime.strptime(deadline, '%m/%d').replace(
                                year=datetime.now().year).strftime('%Y/%m/%d')
                        except ValueError:
                            deadline = '정보 없음'

                    # MongoDB 문서 생성
                    job_data = {
                        'title': title,
                        'job_link': job_link,
                        'company': company,
                        'company_link': company_link,
                        'location': location,
                        'career': career,
                        'education': education,
                        'employment_type': employment_type,
                        'salary': salary,
                        'job_sector': job_sector,
                        'register_date': register_date,
                        'deadline': deadline,
                        'scraped_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    }

                    # 중복 데이터 확인 후 저장
                    if job_link and not collection.find_one({'job_link': job_link}):
                        collection.insert_one(job_data)

                except AttributeError as e:
                    print(f"항목 파싱 중 에러 발생: {e}")
                    continue

            print(f"{page}페이지 크롤링 완료")
            time.sleep(3)  # 서버 부하 방지를 위한 딜레이

        except requests.RequestException as e:
            print(f"페이지 요청 중 에러 발생: {e}")
            continue

def main():
    pages_to_crawl = 5  # 크롤링할 페이지 수
    crawl_saramin(pages=pages_to_crawl)
    print(f"크롤링 완료: 총 {collection.count_documents({})}개 공고 저장")

if __name__ == "__main__":
    main()

import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor
import time
import os
import pandas as pd

# CSV 저장 설정
DATA_DIR = "data"
OUTPUT_FILE = os.path.join(DATA_DIR, "saramin.csv")

def save_to_csv(job_data):
    """
    수집된 데이터를 CSV 파일에 저장
    """
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

    # 기존 데이터 읽기 (중복 방지)
    if os.path.exists(OUTPUT_FILE):
        existing_data = pd.read_csv(OUTPUT_FILE, encoding="utf-8-sig")
        new_data = pd.DataFrame([job_data])
        combined_data = pd.concat([existing_data, new_data]).drop_duplicates(subset=["title", "company"])
    else:
        combined_data = pd.DataFrame([job_data])

    # CSV 파일에 저장
    combined_data.to_csv(OUTPUT_FILE, index=False, encoding="utf-8-sig")
    print(f"CSV 저장 완료: {job_data['title']} - {job_data['company']}")

def parse_job(job):
    try:
        title_tag = job.select_one('h2.job_tit a')
        title = title_tag.text.strip() if title_tag else '정보 없음'
        job_link = 'https://www.saramin.co.kr' + title_tag['href'] if title_tag else '정보 없음'

        company_tag = job.select_one('strong.corp_name a')
        company = company_tag.text.strip() if company_tag else '정보 없음'

        conditions = job.select('div.job_condition span')
        location = conditions[0].text.strip() if len(conditions) > 0 else '정보 없음'
        career = conditions[1].text.strip() if len(conditions) > 1 else '정보 없음'
        education = conditions[2].text.strip() if len(conditions) > 2 else '정보 없음'
        employment_type = conditions[3].text.strip() if len(conditions) > 3 else '정보 없음'
        salary = conditions[4].text.strip() if len(conditions) > 4 else '정보 없음'

        sectors = job.select('div.job_sector a')
        sector_list = [sector.text.strip() for sector in sectors]
        job_sector = ', '.join(sector_list) if sector_list else '정보 없음'

        register_date_tag = job.select_one('span.job_day')
        register_date = register_date_tag.text.strip() if register_date_tag else '정보 없음'
        deadline_tag = job.select_one('span.date')
        deadline = deadline_tag.text.strip() if deadline_tag else '정보 없음'

        return {
            "title": title,
            "job_link": job_link,
            "company": company,
            "location": location,
            "career": career,
            "education": education,
            "employment_type": employment_type,
            "salary": salary,
            "job_sector": job_sector,
            "register_date": register_date,
            "deadline": deadline
        }
    except AttributeError as e:
        print(f"파싱 에러: {e}")
        return None

def crawl_page(page):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Whale/3.28.266.14 Safari/537.36'
    }
    url = f"https://www.saramin.co.kr/zf_user/search?search_area=main&search_done=y&search_optional_item=n&loc_mcd=101000%2C102000&cat_mcls=2&recruitPage={page}&recruitSort=relation&recruitPageCount=40"

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        job_listings = soup.select('div.item_recruit')
        for job in job_listings:
            job_data = parse_job(job)
            if job_data:
                save_to_csv(job_data)

        print(f"{page}페이지 크롤링 완료")
        time.sleep(3)  # 서버 부하 방지를 위한 딜레이
    except requests.RequestException as e:
        print(f"페이지 요청 에러: {e}")

def main():
    pages_to_crawl = 25
    with ThreadPoolExecutor(max_workers=5) as executor:
        executor.map(crawl_page, range(1, pages_to_crawl + 1))

    print("크롤링 완료")

if __name__ == "__main__":
    main()

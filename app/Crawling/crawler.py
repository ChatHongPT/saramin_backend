import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
from app.utils.db import MongoDBManager

def crawl_saramin(pages=1):
    headers = {'User-Agent': 'Mozilla/5.0'}
    base_url = "https://www.saramin.co.kr/zf_user/search?recruitPage={page}&recruitPageCount=40"

    jobs = []
    for page in range(1, pages + 1):
        response = requests.get(base_url.format(page=page), headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        job_listings = soup.select('div.item_recruit')

        for job in job_listings:
            title = job.select_one('h2.job_tit a').text.strip()
            link = 'https://www.saramin.co.kr' + job.select_one('h2.job_tit a')['href']
            company = job.select_one('strong.corp_name a').text.strip()
            location = job.select_one('div.job_condition span').text.strip() if job.select_one('div.job_condition span') else "정보 없음"

            jobs.append({
                "title": title,
                "link": link,
                "company": company,
                "location": location,
                "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            })
    return pd.DataFrame(jobs)

def run_crawler(pages=1):
    df = crawl_saramin(pages)
    mongo = MongoDBManager()
    collection = mongo.db["JobPostings"]
    for _, row in df.iterrows():
        try:
            collection.insert_one(row.to_dict())
        except Exception:
            continue
    mongo.close()
    return len(df)

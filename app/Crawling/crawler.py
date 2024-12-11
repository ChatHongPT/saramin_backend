import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from app.utils.db import MongoDBManager


class SaraminCrawler:
    def __init__(self, mongo_uri="mongodb://localhost:27017/", db_name="WSD-Assignment-03"):
        self.mongo = MongoDBManager(mongo_uri, db_name)
        self.collection = self.mongo.db["JobPostings"]
        self.headers = {'User-Agent': 'Mozilla/5.0'}
        self.base_url = "https://www.saramin.co.kr/zf_user/search?recruitPage={page}&recruitPageCount=40"

    def fetch_page(self, page):
        """Fetch a single page and parse job postings."""
        try:
            response = requests.get(self.base_url.format(page=page), headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            return self.parse_jobs(soup)
        except requests.exceptions.RequestException as e:
            print(f"Error fetching page {page}: {e}")
            return []

    def parse_jobs(self, soup):
        """Parse job postings from a BeautifulSoup object."""
        job_listings = soup.select('div.item_recruit')
        jobs = []
        for job in job_listings:
            try:
                title = job.select_one('h2.job_tit a').text.strip()
                link = 'https://www.saramin.co.kr' + job.select_one('h2.job_tit a')['href']
                company = job.select_one('strong.corp_name a').text.strip()
                location = job.select_one('div.job_condition span').text.strip() if job.select_one('div.job_condition span') else "정보 없음"

                job_data = {
                    "title": title,
                    "link": link,
                    "company": company,
                    "location": location,
                    "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }

                # Check for duplicate
                if not self.collection.find_one({"title": title, "company": company}):
                    jobs.append(job_data)

            except AttributeError:
                continue
        return jobs

    def save_to_mongodb(self, jobs):
        """Save jobs to MongoDB."""
        if not jobs:
            return 0
        try:
            self.collection.insert_many(jobs, ordered=False)
        except Exception as e:
            print(f"Error inserting to MongoDB: {e}")
        return len(jobs)

    def crawl(self, pages=1, use_parallel=True):
        """Crawl job postings from Saramin."""
        all_jobs = []
        if use_parallel:
            with ThreadPoolExecutor(max_workers=5) as executor:
                results = executor.map(self.fetch_page, range(1, pages + 1))
                for jobs in results:
                    all_jobs.extend(jobs)
        else:
            for page in range(1, pages + 1):
                all_jobs.extend(self.fetch_page(page))

        print(f"Fetched {len(all_jobs)} jobs.")
        saved_count = self.save_to_mongodb(all_jobs)
        print(f"Saved {saved_count} new jobs to MongoDB.")
        return saved_count

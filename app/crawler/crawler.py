import requests
from bs4 import BeautifulSoup
import logging
from datetime import datetime
import time
import random
import re
from typing import Dict, List, Optional
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Chrome options for Selenium
chrome_options = Options()
chrome_options.add_argument('--headless')  # Run in headless mode

# Selenium WebDriver initialization
def get_driver():
    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(10)
    return driver

class SaraminCrawler:
    def __init__(self, db):
        """Initialize the crawler"""
        self.db = db
        self.base_url = "https://www.saramin.co.kr/zf_user/search/recruit"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': 'https://www.saramin.co.kr'
        }

    def _get_job_list_page(self, page: int = 1) -> Optional[BeautifulSoup]:
        """Fetch and parse the job listing page."""
        try:
            params = {
                'searchword': '개발자',  # Search keyword
                'recruitPage': page,  # Page number
                'searchType': 'search',  # Search type
                'recruitPageCount': '40',  # Number of results per page
                'recruitSort': 'relation',  # Sorting criteria
                'loc_mcd': '101000',  # Location code (e.g., Seoul)
                'job_type': ''  # Job type code
            }
            
            logger.info(f"Requesting page {page}...")
            response = requests.get(self.base_url, params=params, headers=self.headers, timeout=10)
            response.raise_for_status()

            # Avoid overloading the server
            time.sleep(random.uniform(1, 2))  # Random sleep between requests

            logger.info(f"Page {page} data received.")
            return BeautifulSoup(response.text, 'html.parser')

        except requests.RequestException as e:
            logger.error(f"Failed to fetch page {page}: {e}")
            return None

    def _get_job_detail(self, url: str) -> Optional[Dict]:
        """Extract detailed information about a job listing."""
        try:
            driver = get_driver()
            driver.get(url)
            time.sleep(2)  # Wait for the page to load

            # Extract job description details
            detail_info = {
                'description': '',
                'requirements': [],
                'preferred': [],
                'benefits': [],
                'tasks': [],
                'process': []
            }

            content = driver.find_element(By.CLASS_NAME, "user_content")
            content_text = content.text
            lines = [line.strip() for line in content_text.split('\n') if line.strip()]

            # Parse the content based on sections
            current_section = None
            section_content = []
            skip_keywords = [
                '모집부문', '기타사항', '근무조건', '근무형태', '근무시간', '근무지역', '기타안내', '채용정보', '참고사항'
            ]

            for line in lines:
                if any(keyword in line for keyword in skip_keywords):
                    continue

                # Identify section and store content
                if '담당업무' in line:
                    current_section = 'tasks'
                elif '자격요건' in line:
                    current_section = 'requirements'
                elif '우대사항' in line:
                    current_section = 'preferred'
                elif '복리후생' in line:
                    current_section = 'benefits'
                elif '전형절차' in line:
                    current_section = 'process'

                if current_section:
                    section_content.append(line)
                else:
                    detail_info['description'] += line + '\n'

            # Assign section content to the respective field
            if current_section and section_content:
                detail_info[current_section] = section_content

            driver.quit()
            return detail_info

        except Exception as e:
            logger.error(f"Failed to extract job details from {url}: {e}")
            return None

    def _parse_job_condition(self, condition_element) -> Dict:
        """Parse job conditions like experience, education, etc."""
        conditions = {
            'experience': '',
            'education': '',
            'location': '',
            'job_type': ''
        }

        try:
            condition_spans = condition_element.select('span')
            if len(condition_spans) > 0:
                conditions['location'] = condition_spans[0].text.strip()
            if len(condition_spans) > 1:
                conditions['experience'] = condition_spans[1].text.strip()
            if len(condition_spans) > 2:
                conditions['education'] = condition_spans[2].text.strip()
            if len(condition_spans) > 3:
                conditions['job_type'] = condition_spans[3].text.strip()

        except Exception as e:
            logger.error(f"Failed to parse job conditions: {e}")

        return conditions

    def _save_job_posting(self, job_data: Dict) -> bool:
        """Save the job posting to the database."""
        try:
            # Prevent duplicate entries
            existing = self.db.job_postings.find_one({
                'title': job_data['title'],
                'company_name': job_data['company_name']
            })
            if existing:
                logger.info(f"Duplicate job posting found: {job_data['title']}")
                return False

            # Save new job posting
            self.db.job_postings.insert_one(job_data)
            logger.info(f"Job posting saved: {job_data['title']}")
            return True

        except Exception as e:
            logger.error(f"Failed to save job posting: {e}")
            return False

    def crawl(self, max_pages: int = 5) -> int:
        """Crawl job listings and save them."""
        total_jobs = 0
        page = 1

        while page <= max_pages:
            soup = self._get_job_list_page(page)
            if not soup:
                page += 1
                continue

            job_elements = soup.select('.item_recruit')
            if not job_elements:
                logger.info("No more job postings.")
                break

            for job_element in job_elements:
                try:
                    title_element = job_element.select_one('.job_tit a')
                    company_element = job_element.select_one('.corp_name a')
                    condition_element = job_element.select_one('.job_condition')
                    job_url = 'https://www.saramin.co.kr' + title_element['href']

                    # Extract detailed job info
                    detail_info = self._get_job_detail(job_url)
                    if not detail_info:
                        continue

                    # Extract job conditions
                    conditions = self._parse_job_condition(condition_element)

                    job_data = {
                        'title': title_element.text.strip(),
                        'company_name': company_element.text.strip(),
                        'description': detail_info.get('description', ''),
                        'requirements': detail_info.get('requirements', []),
                        'preferred': detail_info.get('preferred', []),
                        'benefits': detail_info.get('benefits', []),
                        'tasks': detail_info.get('tasks', []),
                        'process': detail_info.get('process', []),
                        'original_url': job_url,
                        'conditions': conditions
                    }

                    # Save the job posting to the database
                    if self._save_job_posting(job_data):
                        total_jobs += 1

                    if total_jobs >= 100:
                        logger.info(f"Reached target of {total_jobs} job postings.")
                        return total_jobs

                except Exception as e:
                    logger.error(f"Error processing job posting: {e}")
                    continue

            page += 1
            time.sleep(random.uniform(2, 4))  # Wait before scraping the next page

        logger.info(f"Crawling completed. Total job postings saved: {total_jobs}")
        return total_jobs

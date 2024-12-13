import axios from 'axios';
import * as cheerio from 'cheerio';
import { JobParser } from './parsers/JobParser.js';
import { CompanyService } from '../services/CompanyService.js';
import { JobService } from '../services/JobService.js';
import { delay } from '../utils/common.js';
import { createAxiosInstance } from '../utils/axios.js';

export class SaraminCrawler {
  constructor() {
    this.axios = createAxiosInstance();
    this.jobParser = new JobParser();
    this.companyService = new CompanyService();
    this.jobService = new JobService();
  }

  async crawl(keyword, pages = 1) {
    console.log(`크롤링 시작: 키워드 "${keyword}", ${pages}페이지`);
    let totalJobs = 0;
    let successCount = 0;
    let failCount = 0;

    for (let page = 1; page <= pages; page++) {
      try {
        console.log(`${page}페이지 크롤링 중...`);
        const jobs = await this.crawlPage(keyword, page);
        
        for (const jobData of jobs) {
          try {
            // 중복 체크
            const exists = await this.jobService.exists(jobData.link);
            if (exists) {
              console.log('이미 존재하는 채용공고 건너뛰기:', jobData.title);
              continue;
            }

            // 회사 정보 처리
            const company = await this.companyService.findOrCreate(jobData.companyName);
            
            // 새 채용공고 저장
            const job = await this.jobService.create({
              ...jobData,
              company: company._id
            });
            
            successCount++;
            console.log('채용공고 저장 성공:', job.title);
          } catch (error) {
            failCount++;
            console.error('채용공고 처리 실패:', error.message);
          }
        }

        totalJobs += jobs.length;
        console.log(`${page}페이지 완료: ${jobs.length}개 채용공고 처리`);
        
        if (page < pages) {
          await delay(2000 + Math.random() * 3000);
        }
      } catch (error) {
        console.error(`${page}페이지 크롤링 실패:`, error.message);
      }
    }

    console.log(`크롤링 완료: 총 ${totalJobs}개 채용공고 중`);
    console.log(`성공: ${successCount}개, 실패: ${failCount}개`);
  }

  async crawlPage(keyword, page) {
    const url = this.buildSearchUrl(keyword, page);
    const response = await this.axios.get(url);
    const $ = cheerio.load(response.data);
    const jobs = [];

    const jobListings = $('.item_recruit');
    for (let i = 0; i < jobListings.length; i++) {
      try {
        const job = jobListings.eq(i);
        const jobData = this.jobParser.parse($, job);
        if (jobData) {
          jobs.push(jobData);
        }
      } catch (error) {
        console.error('채용공고 파싱 실패:', error.message);
      }
    }

    return jobs;
  }

  buildSearchUrl(keyword, page) {
    return `https://www.saramin.co.kr/zf_user/search/recruit?searchType=search&searchword=${encodeURIComponent(keyword)}&recruitPage=${page}`;
  }
}
import axios from 'axios';
import axiosRetry from 'axios-retry';
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

    for (let page = 1; page <= pages; page++) {
      try {
        const jobs = await this.crawlPage(keyword, page);
        totalJobs += jobs.length;
        console.log(`${page}페이지 완료: ${jobs.length}개 채용공고 처리`);
        await delay(2000 + Math.random() * 3000);
      } catch (error) {
        console.error(`${page}페이지 크롤링 실패:`, error.message);
      }
    }

    console.log(`크롤링 완료: 총 ${totalJobs}개 채용공고 처리`);
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
        const jobData = await this.processJobListing($, job);
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

  async processJobListing($, job) {
    const parsedJob = this.jobParser.parse($, job);
    if (!parsedJob) return null;

    // 중복 체크
    const exists = await this.jobService.exists(parsedJob.link);
    if (exists) return null;

    // 회사 정보 처리
    const company = await this.companyService.findOrCreate(parsedJob.companyName);
    
    // 새 채용공고 저장
    return await this.jobService.create({
      ...parsedJob,
      company: company._id
    });
  }
}
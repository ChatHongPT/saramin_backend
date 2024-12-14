import axios from 'axios';
import * as cheerio from 'cheerio';
import { JobParser } from './parsers/JobParser.js';
import { CompanyService } from '../services/CompanyService.js';
import { JobService } from '../services/JobService.js';
import { delay } from '../utils/common.js';
import { createAxiosInstance } from '../utils/axios.js';
import { FileUtils } from '../utils/fileUtils.js';

export class SaraminCrawler {
  constructor() {
    this.axios = createAxiosInstance();
    this.jobParser = new JobParser();
    this.companyService = new CompanyService();
    this.jobService = new JobService();
  }

  async crawl(keyword, pages = 1) {
    console.log(`크롤링 시작: 키워드 "${keyword}", ${pages}페이지`);
    const crawlData = {
      metadata: {
        keyword,
        timestamp: new Date().toISOString(),
        totalJobs: 0,
        successCount: 0,
        failCount: 0
      },
      jobs: []
    };

    for (let page = 1; page <= pages; page++) {
      try {
        console.log(`${page}페이지 크롤링 중...`);
        const jobs = await this.crawlPage(keyword, page);
        
        for (const jobData of jobs) {
          try {
            if (!jobData) continue;
            crawlData.jobs.push(jobData);
            crawlData.metadata.successCount++;
          } catch (error) {
            console.error('채용공고 처리 실패:', error.message);
            crawlData.metadata.failCount++;
          }
        }

        crawlData.metadata.totalJobs += jobs.length;
        console.log(`${page}페이지 완료: ${jobs.length}개 채용공고 처리`);

        if (page < pages) {
          await delay(2000 + Math.random() * 3000);
        }
      } catch (error) {
        console.error(`${page}페이지 크롤링 실패:`, error.message);
      }
    }

    // Save crawled data to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `crawled-data-${timestamp}.json`;
    await FileUtils.saveToJson(crawlData, filename);

    console.log(`크롤링 완료: 총 ${crawlData.metadata.totalJobs}개 채용공고 중`);
    console.log(`성공: ${crawlData.metadata.successCount}개, 실패: ${crawlData.metadata.failCount}개`);
    console.log(`Data saved to ${process.cwd()}/data/${filename}`);
  }

  async crawlPage(keyword, page) {
    const url = this.buildSearchUrl(keyword, page);
    const response = await this.axios.get(url);
    const $ = cheerio.load(response.data);
    const jobs = [];

    $('.item_recruit').each((_, element) => {
      try {
        const jobData = this.jobParser.parse($, $(element));
        if (jobData) {
          jobs.push(jobData);
        }
      } catch (error) {
        console.error('채용공고 파싱 실패:', error.message);
      }
    });

    return jobs;
  }

  buildSearchUrl(keyword, page) {
    return `https://www.saramin.co.kr/zf_user/search/recruit?searchType=search&searchword=${encodeURIComponent(
      keyword
    )}&recruitPage=${page}`;
  }
}
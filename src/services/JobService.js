import { Job } from '../models/Job.js';

export class JobService {
  async exists(link) {
    return await Job.exists({ link });
  }

  async create(jobData) {
    try {
      const job = await Job.create(jobData);
      console.log(`새로운 채용공고 등록: ${jobData.title}`);
      return job;
    } catch (error) {
      console.error(`채용공고 저장 중 오류: ${error.message}`);
      throw error;
    }
  }
}
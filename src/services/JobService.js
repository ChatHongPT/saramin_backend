import { Job } from '../models/Job.js';
import { ApiError } from '../utils/ApiError.js';

export class JobService {
  async getJobs(filters = {}, options = {}) {
    const { page = 1, limit = 20, sort = '-createdAt' } = options;
    const query = { status: 'active' };

    // Apply filters
    if (filters.location) {
      query.location = new RegExp(filters.location, 'i');
    }
    if (filters.experience) {
      query['experience.required'] = new RegExp(filters.experience, 'i');
    }
    if (filters.type) {
      query.type = filters.type;
    }
    if (filters.skills && filters.skills.length > 0) {
      query['skills.name'] = { $in: filters.skills };
    }

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('company')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Job.countDocuments(query),
    ]);

    return { jobs, total };
  }

  async getJobById(id) {
    const job = await Job.findById(id).populate('company');
    if (!job) {
      throw new ApiError(404, '채용 공고를 찾을 수 없습니다.');
    }
    return job;
  }

  async searchJobs(keyword, filters = {}, options = {}) {
    const { page = 1, limit = 20 } = options;
    const query = {
      status: 'active',
      $or: [
        { title: new RegExp(keyword, 'i') },
        { description: new RegExp(keyword, 'i') },
      ],
    };

    // Apply additional filters
    if (filters.location) {
      query.location = new RegExp(filters.location, 'i');
    }
    if (filters.experience) {
      query['experience.required'] = new RegExp(filters.experience, 'i');
    }
    if (filters.type) {
      query.type = filters.type;
    }
    if (filters.skills && filters.skills.length > 0) {
      query['skills.name'] = { $in: filters.skills };
    }

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('company')
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Job.countDocuments(query),
    ]);

    return { jobs, total };
  }

  async incrementViews(id) {
    const job = await Job.findById(id);
    if (!job) {
      throw new ApiError(404, '채용 공고를 찾을 수 없습니다.');
    }
    job.views += 1;
    await job.save();
  }

  async create(jobData) {
    try {
      // 필수 필드 검증
      if (!jobData.title || !jobData.link || !jobData.company) {
        throw new ApiError(400, '필수 필드가 누락되었습니다.');
      }

      // 중복 체크
      const exists = await this.exists(jobData.link);
      if (exists) {
        throw new ApiError(400, '이미 존재하는 채용공고입니다.');
      }

      const job = new Job(jobData);
      await job.save();
      return job;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, `채용공고 저장 중 오류 발생: ${error.message}`);
    }
  }

  async exists(link) {
    if (!link || typeof link !== 'string') {
      throw new ApiError(400, '유효하지 않은 링크입니다.');
    }
    const count = await Job.countDocuments({ link });
    return count > 0;
  }
}

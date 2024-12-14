import { Job } from '../models/Job.js';
import { ApiError } from '../utils/ApiError.js';

export class JobService {
  async getJobs(filters = {}, options = {}) {
    const { page = 1, limit = 20, sort = 'latest' } = options;
    const query = { status: 'active' };

    // 위치 필터
    if (filters.location) {
      query.location = new RegExp(filters.location, 'i');
    }

    // 경력 필터
    if (filters.experience) {
      query['experience.required'] = new RegExp(filters.experience, 'i');
    }

    // 급여 필터
    if (filters.salary) {
      // 숫자만 추출 (예: "3000만원 이상" -> 3000)
      const amount = parseInt(filters.salary.replace(/[^0-9]/g, ''));
      if (!isNaN(amount)) {
        query['salary.min'] = { $gte: amount };
      }
    }

    // 기술스택 필터
    if (filters.skills) {
      const skillsList = filters.skills.split(',').map(s => s.trim());
      if (skillsList.length > 0) {
        query['skills.name'] = { $in: skillsList };
      }
    }

    // 키워드 검색 (제목, 내용)
    if (filters.keyword) {
      query.$or = [
        { title: new RegExp(filters.keyword, 'i') },
        { description: new RegExp(filters.keyword, 'i') },
      ];
    }

    // 회사명 검색
    if (filters.company) {
      query['company.name'] = new RegExp(filters.company, 'i');
    }

    // 포지션 검색
    if (filters.position) {
      query.title = new RegExp(filters.position, 'i');
    }

    // 정렬 조건 설정
    const sortOptions = {
      latest: { createdAt: -1 },
      views: { views: -1, createdAt: -1 },
    };

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('company')
        .sort(sortOptions[sort])
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Job.countDocuments(query),
    ]);

    return { jobs, total };
  }

  // ... other methods remain the same
}
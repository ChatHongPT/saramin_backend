import { Job } from '../models/Job.js';
import { ApiError } from '../utils/ApiError.js';
import { parseSkills, parseSalary } from '../utils/jobUtils.js';

export class JobService {
  // ... existing methods ...

  async getJobById(id) {
    try {
      const job = await Job.findById(id).populate('company');
      if (!job) {
        throw new ApiError(404, '채용 공고를 찾을 수 없습니다.');
      }

      // 조회수 증가
      job.views += 1;
      await job.save();

      // 관련 공고 추천
      const relatedJobs = await this.getRelatedJobs(job);

      return {
        job,
        relatedJobs,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, '채용공고 조회 중 오류가 발생했습니다.');
    }
  }

  async getRelatedJobs(job, limit = 5) {
    // 같은 회사의 다른 공고
    const companyJobs = Job.find({
      company: job.company._id,
      _id: { $ne: job._id },
      status: 'active',
    }).limit(2);

    // 비슷한 기술스택을 가진 다른 회사의 공고
    const skillNames = job.skills.map(skill => skill.name);
    const skillJobs = Job.find({
      _id: { $ne: job._id },
      company: { $ne: job.company._id },
      status: 'active',
      'skills.name': { $in: skillNames },
    })
      .sort({ views: -1 })
      .limit(3);

    const [byCompany, bySkills] = await Promise.all([companyJobs, skillJobs]);
    return [...byCompany, ...bySkills];
  }
}
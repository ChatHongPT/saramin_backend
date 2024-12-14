import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { ApiError } from '../utils/ApiError.js';

export class ApplicationService {
  async createApplication(applicationData) {
    // 채용공고 존재 여부 확인
    const job = await Job.findById(applicationData.job);
    if (!job) {
      throw new ApiError(404, '채용 공고를 찾을 수 없습니다.');
    }

    // 이미 지원한 경우 체크
    const existingApplication = await Application.findOne({
      user: applicationData.user,
      job: applicationData.job,
    });

    if (existingApplication) {
      throw new ApiError(400, '이미 지원한 채용공고입니다.');
    }

    // 지원 마감 여부 확인
    if (job.deadline && new Date(job.deadline) < new Date()) {
      throw new ApiError(400, '지원이 마감된 채용공고입니다.');
    }

    const application = await Application.create(applicationData);
    return application.populate(['job', 'user']);
  }

  async getUserApplications(userId, options = {}, status = null) {
    const { page = 1, limit = 20 } = options;
    const query = { user: userId };

    if (status) {
      query.status = status;
    }

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate(['job', 'user'])
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit),
      Application.countDocuments(query),
    ]);

    return {
      applications,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }

  async getApplicationById(id, userId) {
    const application = await Application.findOne({
      _id: id,
      user: userId,
    }).populate(['job', 'user']);

    if (!application) {
      throw new ApiError(404, '지원 내역을 찾을 수 없습니다.');
    }

    return application;
  }

  async cancelApplication(id, userId) {
    const application = await Application.findOne({
      _id: id,
      user: userId,
    });

    if (!application) {
      throw new ApiError(404, '지원 내역을 찾을 수 없습니다.');
    }

    // 취소 가능 여부 확인 (pending 상태일 때만 취소 가능)
    if (application.status !== 'pending') {
      throw new ApiError(400, '이미 처리된 지원은 취소할 수 없습니다.');
    }

    await application.deleteOne();
  }
}

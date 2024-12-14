import { Resume } from '../models/Resume.js';
import { NotFoundError, BusinessError } from '../utils/errors/index.js';

export class ResumeService {
  async createResume(userId, resumeData) {
    const resume = await Resume.create({
      ...resumeData,
      user: userId
    });
    return resume;
  }

  async getResumes(userId, options = {}) {
    const { page = 1, limit = 10, status } = options;
    const query = { user: userId };

    if (status) {
      query.status = status;
    }

    const [resumes, total] = await Promise.all([
      Resume.find(query)
        .sort('-updatedAt')
        .skip((page - 1) * limit)
        .limit(limit),
      Resume.countDocuments(query)
    ]);

    return { resumes, total };
  }

  async getResumeById(id, userId) {
    const resume = await Resume.findOne({ _id: id, user: userId });
    if (!resume) {
      throw new NotFoundError('이력서');
    }
    return resume;
  }

  async updateResume(id, userId, updateData) {
    const resume = await Resume.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true }
    );

    if (!resume) {
      throw new NotFoundError('이력서');
    }

    return resume;
  }

  async deleteResume(id, userId) {
    const resume = await Resume.findOneAndDelete({ _id: id, user: userId });
    if (!resume) {
      throw new NotFoundError('이력서');
    }

    if (resume.isDefault) {
      // 다른 이력서를 기본으로 설정
      const anotherResume = await Resume.findOne({ user: userId, _id: { $ne: id } });
      if (anotherResume) {
        anotherResume.isDefault = true;
        await anotherResume.save();
      }
    }
  }

  async setDefaultResume(id, userId) {
    const resume = await Resume.findOne({ _id: id, user: userId });
    if (!resume) {
      throw new NotFoundError('이력서');
    }

    resume.isDefault = true;
    await resume.save();
    return resume;
  }

  async createVersion(id, userId) {
    const originalResume = await Resume.findOne({ _id: id, user: userId });
    if (!originalResume) {
      throw new NotFoundError('이력서');
    }

    const newVersion = new Resume({
      ...originalResume.toObject(),
      _id: undefined,
      version: originalResume.version + 1,
      isDefault: false,
      createdAt: undefined,
      updatedAt: undefined
    });

    return await newVersion.save();
  }
}
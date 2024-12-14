import { Resume } from '../models/Resume.js';
import { NotFoundError } from '../utils/errors/index.js';

export class ResumeService {
  async createResume(userId, resumeData) {
    const resume = await Resume.create({
      ...resumeData,
      user: userId,
    });
    return resume;
  }

  async getResumes(userId, options = {}) {
    const { page = 1, limit = 10 } = options;
    const query = { user: userId };

    const [resumes, total] = await Promise.all([
      Resume.find(query)
        .sort('-updatedAt')
        .skip((page - 1) * limit)
        .limit(limit),
      Resume.countDocuments(query),
    ]);

    return { resumes, total };
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
  }
}
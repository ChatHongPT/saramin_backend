import { ResumeService } from '../services/ResumeService.js';
import { successResponse } from '../utils/responseUtils.js';

export class ResumeController {
  constructor() {
    this.resumeService = new ResumeService();
  }

  createResume = async (req, res) => {
    const userId = req.user.id;
    const resumeData = req.body;
    const resume = await this.resumeService.createResume(userId, resumeData);
    
    return successResponse(res, {
      statusCode: 201,
      message: '이력서가 생성되었습니다.',
      data: resume,
    });
  };

  getResumes = async (req, res) => {
    const userId = req.user.id;
    const { page, limit } = req.query;
    const { resumes, total } = await this.resumeService.getResumes(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
    });

    return successResponse(res, {
      data: resumes,
      pagination: {
        total,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      },
    });
  };

  updateResume = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;
    
    const resume = await this.resumeService.updateResume(id, userId, updateData);
    return successResponse(res, {
      message: '이력서가 수정되었습니다.',
      data: resume,
    });
  };

  deleteResume = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    
    await this.resumeService.deleteResume(id, userId);
    return successResponse(res, {
      message: '이력서가 삭제되었습니다.',
    });
  };
}
import { ResumeService } from '../services/ResumeService.js';
import { successResponse, paginatedResponse } from '../utils/responseUtils.js';
import { NotFoundError, BusinessError } from '../utils/errors/index.js';

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
      data: resume
    });
  };

  getResumes = async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const { resumes, total } = await this.resumeService.getResumes(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      status
    });

    return paginatedResponse(res, {
      items: resumes,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  };

  getResumeById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const resume = await this.resumeService.getResumeById(id, userId);
    return successResponse(res, { data: resume });
  };

  updateResume = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const resume = await this.resumeService.updateResume(id, userId, updateData);
    return successResponse(res, {
      message: '이력서가 수정되었습니다.',
      data: resume
    });
  };

  deleteResume = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    await this.resumeService.deleteResume(id, userId);
    return successResponse(res, {
      message: '이력서가 삭제되었습니다.'
    });
  };

  setDefaultResume = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const resume = await this.resumeService.setDefaultResume(id, userId);
    return successResponse(res, {
      message: '기본 이력서가 설정되었습니다.',
      data: resume
    });
  };

  createVersion = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const newVersion = await this.resumeService.createVersion(id, userId);
    return successResponse(res, {
      message: '새로운 버전이 생성되었습니다.',
      data: newVersion
    });
  };
}
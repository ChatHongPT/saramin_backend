import { ApplicationService } from '../services/ApplicationService.js';
import { ApiError } from '../utils/ApiError.js';

export class ApplicationController {
  constructor() {
    this.applicationService = new ApplicationService();
  }

  apply = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const applicationData = {
        ...req.body,
        user: userId
      };

      const application = await this.applicationService.createApplication(applicationData);

      res.status(201).json({
        status: 'success',
        message: '지원이 완료되었습니다.',
        data: application
      });
    } catch (error) {
      next(error);
    }
  };

  getMyApplications = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20, status } = req.query;

      const { applications, pagination } = await this.applicationService.getUserApplications(
        userId,
        { page: parseInt(page), limit: parseInt(limit) },
        status
      );

      res.json({
        status: 'success',
        data: applications,
        pagination
      });
    } catch (error) {
      next(error);
    }
  };

  getApplicationById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const application = await this.applicationService.getApplicationById(id, userId);

      res.json({
        status: 'success',
        data: application
      });
    } catch (error) {
      next(error);
    }
  };

  cancelApplication = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await this.applicationService.cancelApplication(id, userId);

      res.json({
        status: 'success',
        message: '지원이 취소되었습니다.'
      });
    } catch (error) {
      next(error);
    }
  };
}
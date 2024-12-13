import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AuthService } from '../services/AuthService.js';
import { ApiError } from '../utils/ApiError.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res, next) => {
    try {
      const userData = req.body;
      const { user, tokens } = await this.authService.register(userData);
      
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({
        message: '회원가입이 완료되었습니다.',
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        },
        accessToken: tokens.accessToken
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { user, tokens } = await this.authService.login(email, password);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        message: '로그인 성공',
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        },
        accessToken: tokens.accessToken
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new ApiError(401, 'Refresh token not found');
      }

      const tokens = await this.authService.refreshTokens(refreshToken);
      
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        accessToken: tokens.accessToken
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const updateData = req.body;
      const updatedUser = await this.authService.updateProfile(userId, updateData);

      res.json({
        message: '프로필이 업데이트되었습니다.',
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          profile: updatedUser.profile
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const user = await this.authService.getProfile(userId);

      res.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          profile: user.profile
        }
      });
    } catch (error) {
      next(error);
    }
  };

  deleteAccount = async (req, res, next) => {
    try {
      const userId = req.user.id;
      await this.authService.deleteAccount(userId);

      res.clearCookie('refreshToken');
      res.json({
        message: '계정이 삭제되었습니다.'
      });
    } catch (error) {
      next(error);
    }
  };
}
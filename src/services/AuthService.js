import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export class AuthService {
  async register(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ApiError(409, '이미 등록된 이메일입니다.');
    }

    const user = await User.create(userData);
    const tokens = this.generateTokens(user);

    return { user, tokens };
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, '이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    user.lastLogin = new Date();
    await user.save();

    const tokens = this.generateTokens(user);
    return { user, tokens };
  }

  generateTokens(user) {
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        throw new ApiError(401, '유효하지 않은 토큰입니다.');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new ApiError(401, '토큰이 만료되었거나 유효하지 않습니다.');
    }
  }

  async updateProfile(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, '사용자를 찾을 수 없습니다.');
    }

    // 비밀번호 변경 처리
    if (updateData.password) {
      user.password = updateData.password;
    }

    // 기본 정보 업데이트
    if (updateData.name) user.name = updateData.name;
    if (updateData.profile) {
      user.profile = {
        ...user.profile,
        ...updateData.profile
      };
    }

    await user.save();
    return user;
  }

  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, '사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  async deleteAccount(userId) {
    const result = await User.findByIdAndDelete(userId);
    if (!result) {
      throw new ApiError(404, '사용자를 찾을 수 없습니다.');
    }
  }
}
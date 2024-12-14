import { ApiError } from '../ApiError.js';

export class AuthenticationError extends ApiError {
  constructor(message = '인증에 실패했습니다.') {
    super(401, message);
    this.name = 'AuthenticationError';
  }
}
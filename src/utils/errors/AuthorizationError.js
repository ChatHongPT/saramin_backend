import { ApiError } from '../ApiError.js';

export class AuthorizationError extends ApiError {
  constructor(message = '권한이 없습니다.') {
    super(403, message);
    this.name = 'AuthorizationError';
  }
}

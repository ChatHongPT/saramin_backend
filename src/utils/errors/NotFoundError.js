import { ApiError } from '../ApiError.js';

export class NotFoundError extends ApiError {
  constructor(resource = 'Resource') {
    super(404, `${resource}를 찾을 수 없습니다.`);
    this.name = 'NotFoundError';
  }
}

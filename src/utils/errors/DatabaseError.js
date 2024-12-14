import { ApiError } from '../ApiError.js';

export class DatabaseError extends ApiError {
  constructor(message = '데이터베이스 오류가 발생했습니다.') {
    super(500, message);
    this.name = 'DatabaseError';
  }
}

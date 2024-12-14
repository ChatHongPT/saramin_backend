import { ApiError } from '../ApiError.js';

export class BusinessError extends ApiError {
  constructor(message) {
    super(400, message);
    this.name = 'BusinessError';
  }
}
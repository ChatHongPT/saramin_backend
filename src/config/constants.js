export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  VALIDATION: '유효성 검사에 실패했습니다.',
  AUTHENTICATION: '인증에 실패했습니다.',
  AUTHORIZATION: '권한이 없습니다.',
  NOT_FOUND: '리소스를 찾을 수 없습니다.',
  DATABASE: '데이터베이스 오류가 발생했습니다.',
  SERVER: '서버 오류가 발생했습니다.',
};

export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  HTTP: 'http',
  DEBUG: 'debug',
};

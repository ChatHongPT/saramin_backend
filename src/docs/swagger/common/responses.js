export const commonResponses = {
  400: {
    description: '잘못된 요청',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'fail' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  401: {
    description: '인증되지 않은 사용자',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'fail' },
            message: { type: 'string', example: '인증이 필요합니다.' },
          },
        },
      },
    },
  },
  403: {
    description: '권한 없음',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'fail' },
            message: { type: 'string', example: '권한이 없습니다.' },
          },
        },
      },
    },
  },
  404: {
    description: '리소스를 찾을 수 없음',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'fail' },
            message: { type: 'string', example: '요청한 리소스를 찾을 수 없습니다.' },
          },
        },
      },
    },
  },
  409: {
    description: '중복된 리소스',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'fail' },
            message: { type: 'string', example: '이미 존재하는 리소스입니다.' },
          },
        },
      },
    },
  },
  500: {
    description: '서버 오류',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: '서버 오류가 발생했습니다.' },
          },
        },
      },
    },
  },
};
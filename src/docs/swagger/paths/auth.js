import { commonResponses } from '../common/responses.js';

export const authPaths = {
  '/auth/register': {
    post: {
      tags: ['Auth'],
      summary: '회원 가입',
      description: '새로운 사용자 계정을 생성합니다.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RegisterInput' },
          },
        },
      },
      responses: {
        201: {
          description: '회원가입 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      name: { type: 'string' },
                    },
                  },
                  accessToken: { type: 'string' },
                },
              },
            },
          },
        },
        ...commonResponses,
      },
    },
  },
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: '로그인',
      description: '사용자 인증 및 토큰 발급',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginInput' },
          },
        },
      },
      responses: {
        200: {
          description: '로그인 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      name: { type: 'string' },
                    },
                  },
                  accessToken: { type: 'string' },
                },
              },
            },
          },
        },
        ...commonResponses,
      },
    },
  },
  '/auth/refresh': {
    post: {
      tags: ['Auth'],
      summary: '토큰 갱신',
      description: 'Refresh 토큰을 사용하여 새로운 Access 토큰 발급',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: '토큰 갱신 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  accessToken: { type: 'string' },
                },
              },
            },
          },
        },
        ...commonResponses,
      },
    },
  },
  '/auth/profile': {
    get: {
      tags: ['Auth'],
      summary: '회원 정보 조회',
      description: '현재 로그인한 사용자의 프로필 정보 조회',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: '프로필 조회 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: { $ref: '#/components/schemas/ProfileUpdate' },
                },
              },
            },
          },
        },
        ...commonResponses,
      },
    },
    put: {
      tags: ['Auth'],
      summary: '회원 정보 수정',
      description: '사용자 프로필 정보 업데이트',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ProfileUpdate' },
          },
        },
      },
      responses: {
        200: {
          description: '프로필 업데이트 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  user: { $ref: '#/components/schemas/ProfileUpdate' },
                },
              },
            },
          },
        },
        ...commonResponses,
      },
    },
    delete: {
      tags: ['Auth'],
      summary: '회원 탈퇴',
      description: '사용자 계정 삭제',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: '계정 삭제 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: '계정이 삭제되었습니다.' },
                },
              },
            },
          },
        },
        ...commonResponses,
      },
    },
  },
};
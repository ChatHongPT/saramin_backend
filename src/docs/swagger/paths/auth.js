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
        400: { description: '잘못된 입력' },
        409: { description: '이미 존재하는 이메일' },
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
                  accessToken: { type: 'string' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      name: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: '인증 실패' },
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
        401: { description: '토큰 만료 또는 유효하지 않음' },
      },
    },
  },
  '/auth/profile': {
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
        401: { description: '인증되지 않은 사용자' },
      },
    },
  },
};

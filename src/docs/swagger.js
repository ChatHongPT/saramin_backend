export const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Saramin Crawler API',
    version: '1.0.0',
    description: '사람인 채용정보 크롤링 및 관리 API',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: '개발 서버',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: '사용자 이메일',
          },
          name: {
            type: 'string',
            description: '사용자 이름',
          },
          password: {
            type: 'string',
            format: 'password',
            description: '비밀번호 (최소 8자, 영문 대/소문자, 숫자 포함)',
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            description: '사용자 권한',
          },
        },
        required: ['email', 'password', 'name'],
      },
      Profile: {
        type: 'object',
        properties: {
          phone: {
            type: 'string',
            description: '전화번호 (예: 010-1234-5678)',
          },
          address: {
            type: 'string',
            description: '주소',
          },
          skills: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: '보유 기술',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '에러 메시지',
          },
          status: {
            type: 'string',
            description: '에러 상태',
          },
        },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: '회원가입',
        description: '새로운 사용자 계정을 생성합니다.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
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
                    message: {
                      type: 'string',
                      example: '회원가입이 완료되었습니다.',
                    },
                    user: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          example: '507f1f77bcf86cd799439011',
                        },
                        email: {
                          type: 'string',
                          example: 'user@example.com',
                        },
                        name: {
                          type: 'string',
                          example: '홍길동',
                        },
                      },
                    },
                    accessToken: {
                      type: 'string',
                      example: 'eyJhbGciOiJIUzI1NiIs...',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: '잘못된 요청',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          409: {
            description: '이미 존재하는 이메일',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: '로그인',
        description: '사용자 인증 및 토큰 발급',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                  },
                },
                required: ['email', 'password'],
              },
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
                    message: {
                      type: 'string',
                      example: '로그인 성공',
                    },
                    user: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          example: '507f1f77bcf86cd799439011',
                        },
                        email: {
                          type: 'string',
                          example: 'user@example.com',
                        },
                        name: {
                          type: 'string',
                          example: '홍길동',
                        },
                      },
                    },
                    accessToken: {
                      type: 'string',
                      example: 'eyJhbGciOiJIUzI1NiIs...',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: '인증 실패',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: '토큰 갱신',
        description: 'Refresh 토큰을 사용하여 새로운 Access 토큰 발급',
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: '토큰 갱신 성공',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: {
                      type: 'string',
                      example: 'eyJhbGciOiJIUzI1NiIs...',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: '유효하지 않은 토큰',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/profile': {
      get: {
        tags: ['Auth'],
        summary: '프로필 조회',
        description: '현재 로그인한 사용자의 프로필 정보 조회',
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: '프로필 조회 성공',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          example: '507f1f77bcf86cd799439011',
                        },
                        email: {
                          type: 'string',
                          example: 'user@example.com',
                        },
                        name: {
                          type: 'string',
                          example: '홍길동',
                        },
                        profile: {
                          $ref: '#/components/schemas/Profile',
                        },
                      },
                    },
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
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Auth'],
        summary: '프로필 수정',
        description: '사용자 프로필 정보 수정',
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: '새로운 이름',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    description: '새로운 비밀번호',
                  },
                  profile: {
                    $ref: '#/components/schemas/Profile',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: '프로필 수정 성공',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: '프로필이 업데이트되었습니다.',
                    },
                    user: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                        email: {
                          type: 'string',
                        },
                        name: {
                          type: 'string',
                        },
                        profile: {
                          $ref: '#/components/schemas/Profile',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: '잘못된 요청',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          401: {
            description: '인증되지 않은 사용자',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Auth'],
        summary: '계정 삭제',
        description: '사용자 계정 삭제',
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: '계정 삭제 성공',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: '계정이 삭제되었습니다.',
                    },
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
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
  },
};
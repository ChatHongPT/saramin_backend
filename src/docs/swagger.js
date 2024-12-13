export const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Saramin API',
    version: '1.0.0',
    description: '사람인 채용정보 API 문서'
  },
  servers: [
    {
      url: '/api',
      description: 'API 서버'
    }
  ],
  tags: [
    {
      name: 'Auth',
      description: '인증 관련 API'
    },
    {
      name: 'Jobs',
      description: '채용 공고 관련 API'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      // Auth 스키마
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          name: { type: 'string' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      },
      ProfileUpdateRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          password: { type: 'string' },
          profile: {
            type: 'object',
            properties: {
              phone: { type: 'string' },
              address: { type: 'string' },
              skills: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      },
      // Jobs 스키마
      JobResponse: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          company: { $ref: '#/components/schemas/Company' },
          location: { type: 'string' },
          type: {
            type: 'string',
            enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary']
          },
          experience: {
            type: 'object',
            properties: {
              required: { type: 'string' },
              min: { type: 'number' },
              max: { type: 'number' }
            }
          },
          skills: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                level: { type: 'string' },
                required: { type: 'boolean' }
              }
            }
          },
          salary: {
            type: 'object',
            properties: {
              min: { type: 'number' },
              max: { type: 'number' },
              currency: { type: 'string' },
              isNegotiable: { type: 'boolean' }
            }
          }
        }
      },
      Company: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          location: {
            type: 'object',
            properties: {
              address: { type: 'string' },
              coordinates: {
                type: 'array',
                items: { type: 'number' }
              }
            }
          }
        }
      }
    }
  },
  paths: {
    // Auth 엔드포인트
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: '회원가입',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' }
            }
          }
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
                        name: { type: 'string' }
                      }
                    },
                    accessToken: { type: 'string' }
                  }
                }
              }
            }
          },
          400: {
            description: '유효하지 않은 입력'
          }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: '로그인',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
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
                    accessToken: { type: 'string' }
                  }
                }
              }
            }
          },
          401: {
            description: '인증 실패'
          }
        }
      }
    },
    '/auth/profile': {
      get: {
        tags: ['Auth'],
        summary: '프로필 조회',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: '프로필 정보',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        profile: {
                          type: 'object',
                          properties: {
                            phone: { type: 'string' },
                            address: { type: 'string' },
                            skills: {
                              type: 'array',
                              items: { type: 'string' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: '인증되지 않은 사용자'
          }
        }
      },
      put: {
        tags: ['Auth'],
        summary: '프로필 수정',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProfileUpdateRequest' }
            }
          }
        },
        responses: {
          200: {
            description: '프로필 수정 성공'
          },
          401: {
            description: '인증되지 않은 사용자'
          }
        }
      }
    },
    // Jobs 엔드포인트
    '/jobs': {
      get: {
        tags: ['Jobs'],
        summary: '채용 공고 목록 조회',
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 }
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', default: 20 }
          },
          {
            in: 'query',
            name: 'location',
            schema: { type: 'string' }
          },
          {
            in: 'query',
            name: 'experience',
            schema: { type: 'string' }
          },
          {
            in: 'query',
            name: 'skills',
            schema: { type: 'string' }
          },
          {
            in: 'query',
            name: 'type',
            schema: {
              type: 'string',
              enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary']
            }
          }
        ],
        responses: {
          200: {
            description: '채용 공고 목록',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/JobResponse' }
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer' },
                        pages: { type: 'integer' },
                        page: { type: 'integer' },
                        limit: { type: 'integer' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/jobs/search': {
      get: {
        tags: ['Jobs'],
        summary: '채용 공고 검색',
        parameters: [
          {
            in: 'query',
            name: 'keyword',
            required: true,
            schema: { type: 'string' }
          },
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 }
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', default: 20 }
          },
          {
            in: 'query',
            name: 'location',
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: '검색 결과',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/JobResponse' }
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer' },
                        pages: { type: 'integer' },
                        page: { type: 'integer' },
                        limit: { type: 'integer' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/jobs/{id}': {
      get: {
        tags: ['Jobs'],
        summary: '채용 공고 상세 조회',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: '채용 공고 상세 정보',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        job: { $ref: '#/components/schemas/JobResponse' },
                        relatedJobs: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/JobResponse' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: '채용 공고를 찾을 수 없음'
          }
        }
      }
    },
    '/jobs/bookmark/{id}': {
      post: {
        tags: ['Jobs'],
        summary: '채용 공고 북마크',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: '북마크 추가 성공'
          },
          401: {
            description: '인증되지 않은 사용자'
          }
        }
      },
      delete: {
        tags: ['Jobs'],
        summary: '채용 공고 북마크 제거',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: '북마크 제거 성공'
          },
          401: {
            description: '인증되지 않은 사용자'
          }
        }
      }
    }
  }
};
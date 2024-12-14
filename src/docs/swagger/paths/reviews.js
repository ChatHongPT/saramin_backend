export const reviewPaths = {
  '/reviews': {
    post: {
      tags: ['Reviews'],
      summary: '리뷰 작성',
      description: '채용공고에 대한 리뷰를 작성합니다.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ReviewInput' }
          }
        }
      },
      responses: {
        201: {
          description: '리뷰 작성 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string' },
                  message: { type: 'string' },
                  data: { $ref: '#/components/schemas/Review' }
                }
              }
            }
          }
        }
      }
    },
    get: {
      tags: ['Reviews'],
      summary: '리뷰 목록 조회',
      description: '채용공고 또는 회사의 리뷰 목록을 조회합니다.',
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 }
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
        },
        {
          name: 'company',
          in: 'query',
          schema: { type: 'string' },
          description: '회사 ID'
        },
        {
          name: 'job',
          in: 'query',
          schema: { type: 'string' },
          description: '채용공고 ID'
        }
      ],
      responses: {
        200: {
          description: '리뷰 목록 조회 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string' },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Review' }
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      total: { type: 'integer' },
                      pages: { type: 'integer' },
                      currentPage: { type: 'integer' },
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
  '/reviews/{id}': {
    get: {
      tags: ['Reviews'],
      summary: '리뷰 상세 조회',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: '리뷰 조회 성공',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Review' }
            }
          }
        }
      }
    },
    put: {
      tags: ['Reviews'],
      summary: '리뷰 수정',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ReviewInput' }
          }
        }
      },
      responses: {
        200: {
          description: '리뷰 수정 성공',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Review' }
            }
          }
        }
      }
    },
    delete: {
      tags: ['Reviews'],
      summary: '리뷰 삭제',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: '리뷰 삭제 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  },
  '/reviews/{id}/helpful': {
    post: {
      tags: ['Reviews'],
      summary: '리뷰 도움됨 표시',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: '도움됨 표시 성공',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Review' }
            }
          }
        }
      }
    },
    delete: {
      tags: ['Reviews'],
      summary: '리뷰 도움됨 표시 취소',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: '도움됨 표시 취소 성공',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Review' }
            }
          }
        }
      }
    }
  }
};
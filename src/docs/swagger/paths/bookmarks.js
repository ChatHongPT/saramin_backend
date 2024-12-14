export const bookmarkPaths = {
  '/bookmarks': {
    post: {
      tags: ['Bookmarks'],
      summary: '북마크 추가/제거',
      description: '채용 공고를 북마크에 추가하거나 제거합니다.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['jobId'],
              properties: {
                jobId: { 
                  type: 'string',
                  description: '북마크할 채용 공고 ID'
                },
                notes: {
                  type: 'string',
                  description: '북마크에 대한 메모'
                },
                tags: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '북마크 태그'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: '북마크 추가/제거 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string' },
                  message: { type: 'string' },
                  data: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      job: { type: 'string' },
                      user: { type: 'string' },
                      notes: { type: 'string' },
                      tags: {
                        type: 'array',
                        items: { type: 'string' }
                      },
                      createdAt: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          }
        },
        401: { description: '인증되지 않은 사용자' },
        404: { description: '채용 공고를 찾을 수 없음' }
      }
    },
    get: {
      tags: ['Bookmarks'],
      summary: '북마크 목록 조회',
      description: '사용자의 북마크 목록을 조회합니다.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          description: '페이지 번호',
          schema: { type: 'integer', minimum: 1, default: 1 }
        },
        {
          name: 'limit',
          in: 'query',
          description: '페이지당 항목 수',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
        },
        {
          name: 'sort',
          in: 'query',
          description: '정렬 기준 (createdAt: 생성일, -createdAt: 생성일 역순)',
          schema: { type: 'string', default: '-createdAt' }
        }
      ],
      responses: {
        200: {
          description: '북마크 목록 조회 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string' },
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        job: { $ref: '#/components/schemas/Job' },
                        notes: { type: 'string' },
                        tags: {
                          type: 'array',
                          items: { type: 'string' }
                        },
                        createdAt: { type: 'string', format: 'date-time' }
                      }
                    }
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
        },
        401: { description: '인증되지 않은 사용자' }
      }
    }
  }
};
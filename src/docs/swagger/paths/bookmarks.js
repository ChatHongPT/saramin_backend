import { commonResponses } from '../common/responses.js';

export const bookmarkPaths = {
  '/bookmarks': {
    post: {
      tags: ['Bookmarks'],
      summary: '북마크 추가',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['jobId'],
              properties: {
                jobId: { type: 'string', description: '채용공고 ID' }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: '북마크 추가 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  data: { $ref: '#/components/schemas/Bookmark' }
                }
              }
            }
          }
        },
        ...commonResponses
      }
    },
    get: {
      tags: ['Bookmarks'],
      summary: '북마크 목록 조회',
      security: [{ bearerAuth: [] }],
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
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Bookmark' }
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      total: { type: 'integer' },
                      page: { type: 'integer' },
                      limit: { type: 'integer' }
                    }
                  }
                }
              }
            }
          }
        },
        ...commonResponses
      }
    }
  },
  '/bookmarks/{jobId}': {
    delete: {
      tags: ['Bookmarks'],
      summary: '북마크 제거',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'jobId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: '북마크 제거 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        ...commonResponses
      }
    }
  }
};
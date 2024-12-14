import { commonResponses } from '../common/responses.js';

export const searchHistoryPaths = {
  '/search-history': {
    get: {
      tags: ['Search History'],
      summary: '검색 기록 조회',
      description: '사용자의 검색 기록을 조회합니다.',
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
        }
      ],
      responses: {
        200: {
          description: '검색 기록 조회 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/SearchHistory' }
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
    },
    delete: {
      tags: ['Search History'],
      summary: '검색 기록 삭제',
      description: '사용자의 모든 검색 기록을 삭제합니다.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: '검색 기록 삭제 성공',
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
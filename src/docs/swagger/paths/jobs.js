import { commonResponses } from '../common/responses.js';

export const jobPaths = {
  '/jobs': {
    get: {
      tags: ['Jobs'],
      summary: '채용 공고 목록 조회',
      description: '페이지네이션, 필터링, 검색 기능을 제공하는 채용 공고 목록 API',
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
          description: '정렬 기준',
          schema: {
            type: 'string',
            enum: ['latest', 'salary', 'views', 'experience'],
            default: 'latest'
          }
        },
        {
          name: 'keyword',
          in: 'query',
          description: '검색 키워드',
          schema: { type: 'string' }
        },
        {
          name: 'company',
          in: 'query',
          description: '회사명',
          schema: { type: 'string' }
        },
        {
          name: 'location',
          in: 'query',
          description: '지역',
          schema: { type: 'string' }
        },
        {
          name: 'experience',
          in: 'query',
          description: '경력 (예: 0-3, 3-5)',
          schema: { type: 'string' }
        },
        {
          name: 'salary',
          in: 'query',
          description: '급여 범위 (예: 3000-5000)',
          schema: { type: 'string' }
        },
        {
          name: 'skills',
          in: 'query',
          description: '기술스택 (쉼표로 구분)',
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: {
          description: '채용 공고 목록 조회 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Job' }
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
  '/jobs/{id}': {
    get: {
      tags: ['Jobs'],
      summary: '채용 공고 상세 조회',
      description: '채용 공고의 상세 정보와 추천 공고를 조회합니다.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: '채용 공고 ID',
          schema: { type: 'string' }
        },
        {
          name: 'withRecommendations',
          in: 'query',
          description: '추천 공고 포함 여부',
          schema: { type: 'boolean', default: true }
        }
      ],
      responses: {
        200: {
          description: '채용 공고 조회 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      job: { $ref: '#/components/schemas/Job' },
                      recommendations: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Job' }
                      }
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
  }
};
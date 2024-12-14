import { commonResponses } from '../common/responses.js';

export const jobPaths = {
  // ... existing paths ...

  '/jobs/filter': {
    get: {
      tags: ['Jobs'],
      summary: '채용 공고 필터링',
      description: '지역, 경력, 급여, 기술스택 기준으로 채용 공고를 필터링합니다.',
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
          name: 'location',
          in: 'query',
          description: '지역 필터',
          schema: { type: 'string' }
        },
        {
          name: 'experience',
          in: 'query',
          description: '경력 필터 (예: 0-3, 3-5)',
          schema: { type: 'string' }
        },
        {
          name: 'salary',
          in: 'query',
          description: '급여 필터 (예: 3000-5000)',
          schema: { type: 'string' }
        },
        {
          name: 'skills',
          in: 'query',
          description: '기술스택 필터 (쉼표로 구분)',
          schema: { type: 'string' }
        },
        {
          name: 'sort',
          in: 'query',
          description: '정렬 기준',
          schema: {
            type: 'string',
            enum: ['latest', 'salary', 'views'],
            default: 'latest'
          }
        }
      ],
      responses: {
        200: {
          description: '필터링된 채용 공고 목록',
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
  }
};
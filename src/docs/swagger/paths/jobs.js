import { commonResponses } from '../common/responses.js';

export const jobPaths = {
  '/jobs': {
    get: {
      tags: ['Jobs'],
      summary: '채용 공고 목록 조회',
      description: '채용 공고 목록을 조회합니다. (인증 불필요)',
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 },
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        },
        {
          name: 'location',
          in: 'query',
          description: '지역 필터 (예: 서울, 경기)',
          schema: { type: 'string' },
        },
        {
          name: 'experience',
          in: 'query',
          description: '경력 필터 (예: 신입, 3년 이상)',
          schema: { type: 'string' },
        },
        {
          name: 'salary',
          in: 'query',
          description: '급여 필터 (예: 3000만원 이상)',
          schema: { type: 'string' },
        },
        {
          name: 'skills',
          in: 'query',
          description: '기술스택 필터 (콤마로 구분, 예: JavaScript,React,Node.js)',
          schema: { type: 'string' },
        },
        {
          name: 'keyword',
          in: 'query',
          description: '검색 키워드 (제목, 내용 검색)',
          schema: { type: 'string' },
        },
        {
          name: 'company',
          in: 'query',
          description: '회사명 검색',
          schema: { type: 'string' },
        },
        {
          name: 'position',
          in: 'query',
          description: '포지션 검색 (예: 프론트엔드, 백엔드)',
          schema: { type: 'string' },
        },
        {
          name: 'sort',
          in: 'query',
          description: '정렬 기준 (latest: 최신순, views: 조회순)',
          schema: {
            type: 'string',
            enum: ['latest', 'views'],
            default: 'latest',
          },
        },
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
                    items: { $ref: '#/components/schemas/Job' },
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      total: { type: 'integer' },
                      page: { type: 'integer' },
                      limit: { type: 'integer' },
                    },
                  },
                },
              },
            },
          },
        },
        ...commonResponses,
      },
    },
  },
  // ... other paths remain the same
};
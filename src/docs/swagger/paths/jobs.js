export const jobPaths = {
  '/jobs': {
    get: {
      tags: ['Jobs'],
      summary: '채용 공고 목록 조회',
      description:
        '페이지네이션, 필터링, 정렬 기능을 제공하는 채용 공고 목록 API',
      parameters: [
        {
          name: 'page',
          in: 'query',
          description: '페이지 번호',
          schema: { type: 'integer', minimum: 1, default: 1 },
        },
        {
          name: 'limit',
          in: 'query',
          description: '페이지당 항목 수',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        },
        {
          name: 'location',
          in: 'query',
          description: '지역 필터',
          schema: { type: 'string' },
        },
        {
          name: 'experience',
          in: 'query',
          description: '경력 필터',
          schema: { type: 'string' },
        },
        {
          name: 'skills',
          in: 'query',
          description: '기술 스택 필터 (콤마로 구분)',
          schema: { type: 'string' },
        },
        {
          name: 'type',
          in: 'query',
          description: '고용 형태',
          schema: {
            type: 'string',
            enum: [
              'full-time',
              'part-time',
              'contract',
              'internship',
              'temporary',
            ],
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
                      pages: { type: 'integer' },
                      page: { type: 'integer' },
                      limit: { type: 'integer' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/jobs/{id}': {
    get: {
      tags: ['Jobs'],
      summary: '채용 공고 상세 조회',
      description: '채용 공고의 상세 정보를 조회합니다.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: '채용 공고 ID',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: '채용 공고 조회 성공',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Job' },
            },
          },
        },
        404: { description: '채용 공고를 찾을 수 없음' },
      },
    },
  },
};

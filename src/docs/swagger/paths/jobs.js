import { commonResponses } from '../common/responses.js';

export const jobPaths = {
  // ... existing paths ...

  '/jobs/{id}': {
    get: {
      tags: ['Jobs'],
      summary: '채용 공고 상세 조회',
      description: '채용 공고의 상세 정보와 관련 추천 공고를 조회합니다.',
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
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      job: { $ref: '#/components/schemas/Job' },
                      relatedJobs: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Job' },
                        description: '관련 추천 공고 목록',
                      },
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
};
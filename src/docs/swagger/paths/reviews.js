import { commonResponses } from '../common/responses.js';

export const reviewPaths = {
  '/reviews': {
    post: {
      tags: ['Reviews'],
      summary: '리뷰 작성',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['company', 'rating', 'content'],
              properties: {
                company: { type: 'string', description: '회사 ID' },
                rating: { type: 'number', minimum: 1, maximum: 5 },
                content: { type: 'string', maxLength: 2000 },
                pros: { type: 'string', maxLength: 1000 },
                cons: { type: 'string', maxLength: 1000 },
                isAnonymous: { type: 'boolean' },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: '리뷰 작성 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  data: { $ref: '#/components/schemas/Review' },
                },
              },
            },
          },
        },
        ...commonResponses,
      },
    },
    get: {
      tags: ['Reviews'],
      summary: '리뷰 목록 조회',
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
          name: 'company',
          in: 'query',
          schema: { type: 'string' },
          description: '회사 ID',
        },
      ],
      responses: {
        200: {
          description: '리뷰 목록 조회 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Review' },
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
  '/reviews/{id}': {
    put: {
      tags: ['Reviews'],
      summary: '리뷰 수정',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Review' },
          },
        },
      },
      responses: {
        200: {
          description: '리뷰 수정 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  data: { $ref: '#/components/schemas/Review' },
                },
              },
            },
          },
        },
        ...commonResponses,
      },
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
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: '리뷰 삭제 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
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
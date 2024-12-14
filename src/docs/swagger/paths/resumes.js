import { commonResponses } from '../common/responses.js';

export const resumePaths = {
  '/resumes': {
    post: {
      tags: ['Resumes'],
      summary: '이력서 생성',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title'],
              properties: {
                title: { type: 'string' },
                content: { $ref: '#/components/schemas/Resume' },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: '이력서 생성 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  data: { $ref: '#/components/schemas/Resume' },
                },
              },
            },
          },
        },
        ...commonResponses,
      },
    },
    get: {
      tags: ['Resumes'],
      summary: '이력서 목록 조회',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 },
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
        },
      ],
      responses: {
        200: {
          description: '이력서 목록 조회 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Resume' },
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
  '/resumes/{id}': {
    put: {
      tags: ['Resumes'],
      summary: '이력서 수정',
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
            schema: { $ref: '#/components/schemas/Resume' },
          },
        },
      },
      responses: {
        200: {
          description: '이력서 수정 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  data: { $ref: '#/components/schemas/Resume' },
                },
              },
            },
          },
        },
        ...commonResponses,
      },
    },
    delete: {
      tags: ['Resumes'],
      summary: '이력서 삭제',
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
          description: '이력서 삭제 성공',
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
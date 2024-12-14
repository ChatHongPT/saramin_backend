import { commonResponses } from '../common/responses.js';

export const applicationPaths = {
  '/applications': {
    post: {
      tags: ['Applications'],
      summary: '채용 공고 지원',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApplicationInput' },
          },
        },
      },
      responses: {
        201: {
          description: '지원 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  data: { $ref: '#/components/schemas/Application' },
                },
              },
            },
          },
        },
        ...commonResponses,
      },
    },
    get: {
      tags: ['Applications'],
      summary: '지원 내역 조회',
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
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        },
        {
          name: 'status',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['pending', 'accepted', 'rejected'],
          },
        },
      ],
      responses: {
        200: {
          description: '지원 내역 조회 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Application' },
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
  '/applications/{id}': {
    get: {
      tags: ['Applications'],
      summary: '지원 내역 상세 조회',
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
          description: '지원 내역 조회 성공',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { $ref: '#/components/schemas/Application' },
                },
              },
            },
          },
        },
        ...commonResponses,
      },
    },
    delete: {
      tags: ['Applications'],
      summary: '지원 취소',
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
          description: '지원 취소 성공',
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
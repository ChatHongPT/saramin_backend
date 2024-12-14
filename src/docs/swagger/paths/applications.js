export const applicationPaths = {
  '/applications': {
    post: {
      tags: ['Applications'],
      summary: '채용 공고 지원',
      description: '채용 공고에 지원합니다.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Application' },
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
        400: { description: '잘못된 요청 또는 이미 지원한 공고' },
        401: { description: '인증되지 않은 사용자' },
      },
    },
    get: {
      tags: ['Applications'],
      summary: '지원 내역 조회',
      description: '사용자의 지원 내역을 조회합니다.',
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
            enum: [
              'pending',
              'reviewed',
              'shortlisted',
              'rejected',
              'accepted',
            ],
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
  '/applications/{id}': {
    get: {
      tags: ['Applications'],
      summary: '지원 내역 상세 조회',
      description: '특정 지원 내역의 상세 정보를 조회합니다.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: '지원 내역 ID',
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
                  status: { type: 'string' },
                  data: { $ref: '#/components/schemas/Application' },
                },
              },
            },
          },
        },
        401: { description: '인증되지 않은 사용자' },
        404: { description: '지원 내역을 찾을 수 없음' },
      },
    },
    delete: {
      tags: ['Applications'],
      summary: '지원 취소',
      description:
        '지원을 취소합니다. pending 상태인 지원만 취소할 수 있습니다.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: '취소할 지원 내역 ID',
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
                  status: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        400: { description: '이미 처리된 지원은 취소할 수 없음' },
        401: { description: '인증되지 않은 사용자' },
        404: { description: '지원 내역을 찾을 수 없음' },
      },
    },
  },
};

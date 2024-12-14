export const resumePaths = {
  '/resumes': {
    post: {
      tags: ['Resumes'],
      summary: '이력서 생성',
      description: '새로운 이력서를 생성합니다.',
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
                content: {
                  type: 'object',
                  properties: {
                    basicInfo: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        phone: { type: 'string' },
                        address: { type: 'string' },
                      },
                    },
                    education: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          school: { type: 'string' },
                          degree: { type: 'string' },
                          field: { type: 'string' },
                          startDate: { type: 'string', format: 'date' },
                          endDate: { type: 'string', format: 'date' },
                        },
                      },
                    },
                    experience: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          company: { type: 'string' },
                          position: { type: 'string' },
                          startDate: { type: 'string', format: 'date' },
                          endDate: { type: 'string', format: 'date' },
                          description: { type: 'string' },
                        },
                      },
                    },
                    skills: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                },
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
            schema: {
              $ref: '#/components/schemas/Resume',
            },
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
      },
    },
  },
};
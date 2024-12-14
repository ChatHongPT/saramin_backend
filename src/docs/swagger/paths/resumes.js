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
            schema: { $ref: '#/components/schemas/ResumeInput' },
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
                  status: { type: 'string' },
                  message: { type: 'string' },
                  data: { $ref: '#/components/schemas/Resume' },
                },
              },
            },
          },
        },
        400: { description: '잘못된 입력' },
        401: { description: '인증되지 않은 사용자' },
      },
    },
    get: {
      tags: ['Resumes'],
      summary: '이력서 목록 조회',
      description: '사용자의 이력서 목록을 조회합니다.',
      security: [{ bearerAuth: [] }],
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
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
        },
        {
          name: 'status',
          in: 'query',
          description: '이력서 상태',
          schema: {
            type: 'string',
            enum: ['draft', 'active', 'archived'],
          },
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
                  status: { type: 'string' },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Resume' },
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      total: { type: 'integer' },
                      pages: { type: 'integer' },
                      currentPage: { type: 'integer' },
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
    get: {
      tags: ['Resumes'],
      summary: '이력서 상세 조회',
      description: '특정 이력서의 상세 정보를 조회합니다.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: '이력서 ID',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: '이력서 조회 성공',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Resume' },
            },
          },
        },
        404: { description: '이력서를 찾을 수 없음' },
      },
    },
    put: {
      tags: ['Resumes'],
      summary: '이력서 수정',
      description: '이력서 정보를 수정합니다.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: '이력서 ID',
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ResumeInput' },
          },
        },
      },
      responses: {
        200: {
          description: '이력서 수정 성공',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Resume' },
            },
          },
        },
      },
    },
    delete: {
      tags: ['Resumes'],
      summary: '이력서 삭제',
      description: '이력서를 삭제합니다.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: '이력서 ID',
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
                  status: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  '/resumes/{id}/default': {
    put: {
      tags: ['Resumes'],
      summary: '기본 이력서 설정',
      description: '특정 이력서를 기본 이력서로 설정합니다.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: '이력서 ID',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: '기본 이력서 설정 성공',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Resume' },
            },
          },
        },
      },
    },
  },
  '/resumes/{id}/versions': {
    post: {
      tags: ['Resumes'],
      summary: '이력서 버전 생성',
      description: '현재 이력서의 새로운 버전을 생성합니다.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: '이력서 ID',
          schema: { type: 'string' },
        },
      ],
      responses: {
        201: {
          description: '새 버전 생성 성공',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Resume' },
            },
          },
        },
      },
    },
  },
};

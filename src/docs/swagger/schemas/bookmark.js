export const bookmarkSchemas = {
  Bookmark: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      user: { type: 'string', description: '사용자 ID' },
      job: { $ref: '#/components/schemas/Job' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  }
};
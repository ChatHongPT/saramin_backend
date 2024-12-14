export const reviewSchemas = {
  Review: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      user: { type: 'string', description: '사용자 ID' },
      company: { type: 'string', description: '회사 ID' },
      rating: { type: 'number', minimum: 1, maximum: 5 },
      content: { type: 'string', maxLength: 2000 },
      pros: { type: 'string', maxLength: 1000 },
      cons: { type: 'string', maxLength: 1000 },
      isAnonymous: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
};
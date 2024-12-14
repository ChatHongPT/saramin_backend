export const schemas = {
  // ... other schemas ...

  Resume: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      user: { type: 'string', description: '사용자 ID' },
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
      status: {
        type: 'string',
        enum: ['draft', 'active'],
      },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

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

  // ... other schemas ...
};
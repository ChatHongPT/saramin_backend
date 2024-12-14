export const jobSchemas = {
  Job: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      company: { type: 'string', description: '회사 ID' },
      title: { type: 'string' },
      description: { type: 'string' },
      location: { type: 'string' },
      type: {
        type: 'string',
        enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
      },
      experience: {
        type: 'object',
        properties: {
          required: { type: 'string' },
          min: { type: 'number' },
          max: { type: 'number' },
        },
      },
      education: {
        type: 'object',
        properties: {
          level: { type: 'string' },
          field: { type: 'string' },
          required: { type: 'boolean' },
        },
      },
      salary: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          isNegotiable: { type: 'boolean' },
          currency: { type: 'string', default: 'KRW' },
        },
      },
      skills: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            level: {
              type: 'string',
              enum: ['beginner', 'intermediate', 'advanced', 'expert'],
            },
            required: { type: 'boolean' },
          },
        },
      },
      status: {
        type: 'string',
        enum: ['active', 'closed', 'draft'],
      },
      views: { type: 'number' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
};
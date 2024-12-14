export const resumeSchemas = {
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
};
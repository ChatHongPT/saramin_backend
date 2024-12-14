// Update the Application schema in schemas.js
export const schemas = {
  // ... other schemas ...

  Application: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      job: { type: 'string', description: '채용공고 ID' },
      user: { type: 'string', description: '사용자 ID' },
      status: {
        type: 'string',
        enum: ['pending', 'accepted', 'rejected'],
      },
      resume: {
        type: 'object',
        properties: {
          url: { type: 'string' },
          version: { type: 'number' },
        },
      },
      coverLetter: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },

  // ... other schemas ...
};
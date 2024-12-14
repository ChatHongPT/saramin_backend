export const applicationSchemas = {
  Application: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      job: { type: 'string', description: '채용공고 ID' },
      user: { type: 'string', description: '사용자 ID' },
      status: {
        type: 'string',
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
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

  ApplicationInput: {
    type: 'object',
    required: ['job'],
    properties: {
      job: { type: 'string', description: '채용공고 ID' },
      resume: {
        type: 'object',
        properties: {
          url: { type: 'string' },
          version: { type: 'number' },
        },
      },
      coverLetter: { type: 'string' },
    },
  },
};
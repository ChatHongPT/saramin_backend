export const notificationSchemas = {
  Notification: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      user: { type: 'string', description: '사용자 ID' },
      title: { type: 'string' },
      content: { type: 'string' },
      type: {
        type: 'string',
        enum: ['job', 'application', 'system']
      },
      isRead: { type: 'boolean' },
      job: { 
        type: 'string',
        description: '관련 채용공고 ID (선택)'
      },
      createdAt: { type: 'string', format: 'date-time' }
    }
  }
};
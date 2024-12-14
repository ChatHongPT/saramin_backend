export const searchHistorySchemas = {
    SearchHistory: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        user: { type: 'string', description: '사용자 ID' },
        query: { type: 'string', description: '검색어' },
        filters: {
          type: 'object',
          properties: {
            location: { type: 'string' },
            skills: { 
              type: 'array',
              items: { type: 'string' }
            },
            experience: { type: 'string' },
            salary: {
              type: 'object',
              properties: {
                min: { type: 'number' },
                max: { type: 'number' }
              }
            },
            jobType: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        results: {
          type: 'object',
          properties: {
            count: { type: 'number' },
            relevance: { type: 'number' }
          }
        },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  };
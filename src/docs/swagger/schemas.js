export const schemas = {
  // Auth schemas
  RegisterInput: {
    type: 'object',
    required: ['email', 'password', 'name'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
      name: { type: 'string', minLength: 2 }
    }
  },
  LoginInput: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    }
  },
  
  // User schemas
  User: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      email: { type: 'string', format: 'email' },
      name: { type: 'string' },
      profile: {
        type: 'object',
        properties: {
          phone: { type: 'string' },
          address: { type: 'string' },
          skills: { type: 'array', items: { type: 'string' } },
          experience: { type: 'array', items: { type: 'string' } },
          education: { type: 'array', items: { type: 'string' } }
        }
      }
    }
  },

  // Company schemas
  Company: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string' },
      industry: { type: 'array', items: { type: 'string' } },
      size: { 
        type: 'string',
        enum: ['startup', 'small', 'medium', 'large', 'enterprise']
      },
      location: {
        type: 'object',
        properties: {
          address: { type: 'string' },
          city: { type: 'string' },
          country: { type: 'string' }
        }
      }
    }
  },

  // Job schemas
  Job: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      company: { $ref: '#/components/schemas/Company' },
      description: { type: 'string' },
      location: { type: 'string' },
      type: { 
        type: 'string',
        enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary']
      },
      experience: {
        type: 'object',
        properties: {
          required: { type: 'string' },
          min: { type: 'number' },
          max: { type: 'number' }
        }
      },
      skills: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            level: { 
              type: 'string',
              enum: ['beginner', 'intermediate', 'advanced', 'expert']
            },
            required: { type: 'boolean' }
          }
        }
      },
      salary: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          isNegotiable: { type: 'boolean' },
          currency: { type: 'string' }
        }
      }
    }
  },

  // Review schemas
  ReviewInput: {
    type: 'object',
    required: ['job', 'rating', 'content'],
    properties: {
      job: { type: 'string' },
      rating: {
        type: 'object',
        required: ['overall', 'workLifeBalance', 'compensation', 'culture'],
        properties: {
          overall: { type: 'number', minimum: 1, maximum: 5 },
          workLifeBalance: { type: 'number', minimum: 1, maximum: 5 },
          compensation: { type: 'number', minimum: 1, maximum: 5 },
          culture: { type: 'number', minimum: 1, maximum: 5 }
        }
      },
      content: { type: 'string', maxLength: 2000 },
      pros: { type: 'string', maxLength: 1000 },
      cons: { type: 'string', maxLength: 1000 },
      isAnonymous: { type: 'boolean' }
    }
  },
  Review: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      user: { $ref: '#/components/schemas/User' },
      job: { $ref: '#/components/schemas/Job' },
      company: { $ref: '#/components/schemas/Company' },
      rating: {
        type: 'object',
        properties: {
          overall: { type: 'number' },
          workLifeBalance: { type: 'number' },
          compensation: { type: 'number' },
          culture: { type: 'number' }
        }
      },
      content: { type: 'string' },
      pros: { type: 'string' },
      cons: { type: 'string' },
      status: {
        type: 'string',
        enum: ['pending', 'approved', 'rejected']
      },
      isAnonymous: { type: 'boolean' },
      helpfulCount: { type: 'number' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },

  // Application schemas
  Application: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      job: { $ref: '#/components/schemas/Job' },
      user: { $ref: '#/components/schemas/User' },
      status: {
        type: 'string',
        enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted']
      },
      resume: {
        type: 'object',
        properties: {
          url: { type: 'string' },
          version: { type: 'number' }
        }
      },
      coverLetter: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },

  // Resume schemas
  ResumeInput: {
    type: 'object',
    required: ['title'],
    properties: {
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
              address: { type: 'string' }
            }
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
                description: { type: 'string' }
              }
            }
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
                achievements: {
                  type: 'array',
                  items: { type: 'string' }
                }
              }
            }
          },
          skills: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                category: { type: 'string' },
                items: {
                  type: 'array',
                  items: { type: 'string' }
                }
              }
            }
          }
        }
      },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'archived']
      }
    }
  }
};
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
  },
  Resume: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      user: { type: 'string' },
      isDefault: { type: 'boolean' },
      version: { type: 'integer' },
      content: { $ref: '#/components/schemas/ResumeInput/properties/content' },
      status: { $ref: '#/components/schemas/ResumeInput/properties/status' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  }
};
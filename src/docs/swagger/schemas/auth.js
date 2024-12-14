export const authSchemas = {
  RegisterInput: {
    type: 'object',
    required: ['email', 'password', 'name'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
      name: { type: 'string', minLength: 2 },
    },
  },

  LoginInput: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
  },

  ProfileUpdate: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 2 },
      password: { type: 'string', minLength: 8 },
      profile: {
        type: 'object',
        properties: {
          phone: { type: 'string' },
          address: { type: 'string' },
          skills: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
};
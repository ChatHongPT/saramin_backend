import { schemas } from './swagger/schemas/index.js';
import { authPaths } from './swagger/paths/auth.js';
import { jobPaths } from './swagger/paths/jobs.js';
import { applicationPaths } from './swagger/paths/applications.js';
import { resumePaths } from './swagger/paths/resumes.js';
import { reviewPaths } from './swagger/paths/reviews.js';
import { searchHistoryPaths } from './swagger/paths/searchHistory.js';

export const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Saramin API',
    version: '1.0.0',
    description: '사람인 채용정보 API 문서',
  },
  servers: [
    {
      url: '/api',
      description: 'API 서버',
    },
  ],
  tags: [
    { name: 'Auth', description: '인증 관련 API' },
    { name: 'Jobs', description: '채용 공고 관련 API' },
    { name: 'Applications', description: '지원 관련 API' },
    { name: 'Resumes', description: '이력서 관련 API' },
    { name: 'Reviews', description: '리뷰 관련 API' },
    { name: 'Search History', description: '검색 기록 관련 API' },
  ],
  components: {
    schemas,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    ...authPaths,
    ...jobPaths,
    ...applicationPaths,
    ...resumePaths,
    ...reviewPaths,
    ...searchHistoryPaths,
  },
};
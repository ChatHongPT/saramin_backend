import { schemas } from './swagger/schemas/index.js';
import { authPaths } from './swagger/paths/auth.js';
import { jobPaths } from './swagger/paths/jobs.js';
import { applicationPaths } from './swagger/paths/applications.js';
import { bookmarkPaths } from './swagger/paths/bookmarks.js';
import { resumePaths } from './swagger/paths/resumes.js';
import { reviewPaths } from './swagger/paths/reviews.js';
import { notificationPaths } from './swagger/paths/notifications.js';

export const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Saramin API',
    version: '1.0.0',
    description: '사람인 채용정보 API 문서',
  },
  servers: [
    {
      url: 'http://113.198.66.75:13085',
      description: 'Production server (Cloud)',
    },
    {
      url: 'http://localhost:3000',
      description: 'Development server (Local)',
    },
  ],
  tags: [
    { name: 'Auth', description: '인증 관련 API' },
    { name: 'Jobs', description: '채용 공고 관련 API' },
    { name: 'Applications', description: '지원 관련 API' },
    { name: 'Bookmarks', description: '북마크 관련 API' },
    { name: 'Resumes', description: '이력서 관련 API' },
    { name: 'Reviews', description: '리뷰 관련 API' },
    { name: 'Notifications', description: '알림 관련 API' },
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
    ...bookmarkPaths,
    ...resumePaths,
    ...reviewPaths,
    ...notificationPaths,
  },
};

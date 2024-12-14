import { authSchemas } from './auth.js';
import { jobSchemas } from './job.js';
import { applicationSchemas } from './application.js';
import { bookmarkSchemas } from './bookmark.js';
import { resumeSchemas } from './resume.js';
import { reviewSchemas } from './review.js';
import { notificationSchemas } from './notification.js';

export const schemas = {
  ...authSchemas,
  ...jobSchemas,
  ...applicationSchemas,
  ...bookmarkSchemas,
  ...resumeSchemas,
  ...reviewSchemas,
  ...notificationSchemas,
};
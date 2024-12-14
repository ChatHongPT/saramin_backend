import { authSchemas } from './auth.js';
import { jobSchemas } from './job.js';
import { resumeSchemas } from './resume.js';
import { reviewSchemas } from './review.js';
import { applicationSchemas } from './application.js';
import { searchHistorySchemas } from './searchHistory.js';

export const schemas = {
  ...authSchemas,
  ...jobSchemas,
  ...resumeSchemas,
  ...reviewSchemas,
  ...applicationSchemas,
  ...searchHistorySchemas,
};
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import xss from 'xss-clean';

// Rate limiting
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
});

// API specific rate limiter
export const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000,
  message: 'API 호출 한도를 초과했습니다. 1시간 후 다시 시도해주세요.'
});

// Auth endpoints rate limiter
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: '로그인 시도가 너무 많습니다. 1시간 후 다시 시도해주세요.'
});

// Data sanitization against NoSQL query injection
export const sanitizeData = mongoSanitize();

// Data sanitization against XSS
export const preventXSS = xss();

// Prevent parameter pollution
export const preventParamPollution = hpp();
import { catchAsync } from '../utils/errorUtils.js';

export const asyncWrapper = (controller) => {
  return Object.keys(controller).reduce((wrapped, key) => {
    if (typeof controller[key] === 'function') {
      wrapped[key] = catchAsync(controller[key]);
    }
    return wrapped;
  }, {});
};
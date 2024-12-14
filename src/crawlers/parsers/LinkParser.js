import { ApiError } from '../../utils/ApiError.js';

export class LinkParser {
  static parse(rawLink) {
    if (!rawLink) {
      throw new ApiError(400, '링크가 없습니다.');
    }

    // Extract job ID from href attribute
    const recIdxMatch = rawLink.match(/rec_idx=(\d+)/);
    if (recIdxMatch) {
      return `https://www.saramin.co.kr/zf_user/jobs/relay/view?rec_idx=${recIdxMatch[1]}`;
    }

    // Extract job ID from URL path
    const pathMatch = rawLink.match(/\/recruit\/[\w-]+\/(\d+)/);
    if (pathMatch) {
      return `https://www.saramin.co.kr/zf_user/jobs/relay/view?rec_idx=${pathMatch[1]}`;
    }

    throw new ApiError(400, '유효하지 않은 채용공고 링크입니다.');
  }
}
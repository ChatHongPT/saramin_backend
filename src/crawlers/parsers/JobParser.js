import { parseSalaryText } from '../../utils/salaryUtils.js';

export class JobParser {
  // ... other methods ...

  parseSalary(job) {
    const salaryText = job.find('.salary_info').text().trim() ||
                      job.find('.area_badge .salary').text().trim() ||
                      '회사내규에 따름';

    const { min, max, isNegotiable } = parseSalaryText(salaryText);

    return {
      text: salaryText,
      min,
      max,
      isNegotiable,
      currency: 'KRW'
    };
  }
}
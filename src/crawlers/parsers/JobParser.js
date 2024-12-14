import { SalaryParser } from '../../utils/salaryParser.js';

export class JobParser {
  parse($, job) {
    try {
      // ... other parsing logic ...

      const salaryText = job.find('.salary_info').text().trim() ||
                        job.find('.area_badge .salary').text().trim();
      
      const salary = SalaryParser.parse(salaryText);

      const jobData = {
        // ... other fields ...
        salary,
      };

      return jobData;
    } catch (error) {
      console.error('채용공고 파싱 실패:', error.message);
      return null;
    }
  }

  // ... other methods ...
}
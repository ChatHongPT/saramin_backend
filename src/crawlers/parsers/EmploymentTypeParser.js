export class EmploymentTypeParser {
  static parse(text) {
    const typeMap = {
      정규직: 'full-time',
      계약직: 'contract',
      인턴: 'internship',
      파견직: 'temporary',
      아르바이트: 'part-time',
    };

    for (const [key, value] of Object.entries(typeMap)) {
      if (text.includes(key)) return value;
    }
    return 'full-time';
  }
}
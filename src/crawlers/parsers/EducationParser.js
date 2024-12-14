export class EducationParser {
  static parse(text) {
    return {
      level: text,
      required: !text.includes('무관'),
      field: '',
    };
  }
}
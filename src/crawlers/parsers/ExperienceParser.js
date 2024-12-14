export class ExperienceParser {
  static parse(text) {
    return {
      required: text,
      min: 0,
      max: text.includes('무관') ? 99 : this.extractYears(text),
    };
  }

  static extractYears(text) {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }
}
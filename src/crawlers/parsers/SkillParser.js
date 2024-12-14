export class SkillParser {
  static parse($, job) {
    const skills = new Set();

    // Extract skills from job sector
    job.find('.job_sector span:not(.bar)').each((_, elem) => {
      const skill = $(elem).text().trim();
      if (skill && !skill.includes('등록일')) {
        skills.add(skill);
      }
    });

    // Extract skills from links
    job.find('.job_sector a').each((_, elem) => {
      const skill = $(elem).text().trim();
      if (skill) {
        skills.add(skill);
      }
    });

    return Array.from(skills)
      .filter((skill) => skill.length > 0)
      .map((name) => ({
        name,
        level: 'intermediate',
        required: true,
      }));
  }
}
export class JobParser {
  parse($, job) {
    try {
      const companyName = job.find('.corp_name a').text().trim();
      const title = job.find('.job_tit a').text().trim();
      const rawLink = job.find('.job_tit a').attr('href');
      const link = rawLink ? 'https://www.saramin.co.kr' + rawLink : null;

      if (!companyName || !title || !link) {
        console.log('필수 정보 누락:', { companyName, title, link });
        return null;
      }

      const conditions = job.find('.job_condition span');
      const location = conditions.eq(0).text().trim();
      const experience = this.parseExperience(conditions.eq(1).text().trim());
      const education = this.parseEducation(conditions.eq(2).text().trim());
      const employmentType = this.parseEmploymentType(
        conditions.eq(3).text().trim()
      );

      const jobData = {
        companyName,
        title,
        link,
        location,
        type: employmentType,
        experience,
        education,
        description: this.parseDescription(job),
        salary: this.parseSalary(job),
        skills: this.parseSkills($, job),
      };

      return jobData;
    } catch (error) {
      console.error('채용공고 파싱 실패:', error.message);
      return null;
    }
  }

  parseExperience(text) {
    return {
      required: text,
      min: 0,
      max: text.includes('무관') ? 99 : this.extractYears(text),
    };
  }

  parseEducation(text) {
    return {
      level: text,
      required: !text.includes('무관'),
      field: '',
    };
  }

  parseEmploymentType(text) {
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

  parseDescription(job) {
    const description = [];

    // 직무 내용
    const sector = job.find('.job_sector').text().trim();
    if (sector) {
      description.push(sector.split('등록일')[0].trim());
    }

    // 기타 정보
    const details = job.find('.job_summary').text().trim();
    if (details) {
      description.push(details);
    }

    return description.join('\n\n');
  }

  parseSalary(job) {
    const salaryText =
      job.find('.salary_info').text().trim() ||
      job.find('.area_badge .salary').text().trim() ||
      '회사내규에 따름';

    return {
      text: salaryText,
      isNegotiable:
        salaryText.includes('회사내규') || salaryText.includes('협의'),
      currency: 'KRW',
    };
  }

  parseSkills($, job) {
    const skills = new Set();

    // 기술 스택 추출
    job.find('.job_sector span:not(.bar)').each((_, elem) => {
      const skill = $(elem).text().trim();
      if (skill && !skill.includes('등록일')) {
        skills.add(skill);
      }
    });

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

  extractYears(text) {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }
}

import { LinkParser } from './LinkParser.js';
import { ExperienceParser } from './ExperienceParser.js';
import { EducationParser } from './EducationParser.js';
import { EmploymentTypeParser } from './EmploymentTypeParser.js';
import { SkillParser } from './SkillParser.js';
import { SalaryParser } from './SalaryParser.js';

export class JobParser {
  parse($, job) {
    try {
      // Extract company name
      const companyName = job.find('.corp_name a').text().trim();
      if (!companyName) {
        console.log('회사명 누락');
        return null;
      }

      // Extract job title
      const title = job.find('.job_tit a').text().trim();
      if (!title) {
        console.log('채용공고 제목 누락');
        return null;
      }

      // Extract and validate link
      const rawLink = job.find('.job_tit a').attr('href');
      let link;
      try {
        link = LinkParser.parse(rawLink);
      } catch (error) {
        console.log('링크 파싱 실패:', error.message);
        return null;
      }

      // Extract conditions
      const conditions = job.find('.job_condition span');
      const location = conditions.eq(0).text().trim();
      const experience = ExperienceParser.parse(conditions.eq(1).text().trim());
      const education = EducationParser.parse(conditions.eq(2).text().trim());
      const employmentType = EmploymentTypeParser.parse(conditions.eq(3).text().trim());

      // Extract salary
      const salaryText = job.find('.salary_info').text().trim() ||
                        job.find('.area_job_list .salary').text().trim() ||
                        job.find('.job_salary').text().trim() ||
                        '회사내규에 따름';

      const jobData = {
        companyName,
        title,
        link,
        location,
        type: employmentType,
        experience,
        education,
        description: this.parseDescription(job),
        salary: SalaryParser.parse(salaryText),
        skills: SkillParser.parse($, job),
        deadline: this.parseDeadline(job),
        status: 'active'
      };

      return jobData;
    } catch (error) {
      console.error('채용공고 파싱 실패:', error.message);
      return null;
    }
  }

  parseDescription(job) {
    const description = [];

    // Job sector description
    const sector = job.find('.job_sector').text().trim();
    if (sector) {
      description.push(sector.split('등록일')[0].trim());
    }

    // Additional details
    const details = job.find('.job_summary').text().trim();
    if (details) {
      description.push(details);
    }

    // Work info
    const workInfo = job.find('.work_info').text().trim();
    if (workInfo) {
      description.push(workInfo);
    }

    return description.join('\n\n');
  }

  parseDeadline(job) {
    const deadlineText = job.find('.date').text().trim();
    if (!deadlineText) return null;

    // Parse deadline text to date
    const match = deadlineText.match(/(\d{2})\/(\d{2})/);
    if (match) {
      const [_, month, day] = match;
      const year = new Date().getFullYear();
      return new Date(year, parseInt(month) - 1, parseInt(day));
    }

    return null;
  }
}
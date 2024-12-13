export class JobParser {
  parse($, job) {
    const companyName = job.find('.corp_name a').text().trim();
    const title = job.find('.job_tit a').text().trim();
    const link = 'https://www.saramin.co.kr' + job.find('.job_tit a').attr('href');

    if (!companyName || !title || !link) {
      return null;
    }

    const conditions = job.find('.job_condition span');
    const jobData = {
      companyName,
      title,
      link,
      location: conditions.eq(0).text().trim(),
      experience: conditions.eq(1).text().trim(),
      education: conditions.eq(2).text().trim(),
      employmentType: conditions.eq(3).text().trim(),
      deadline: job.find('.job_date .date').text().trim(),
      sector: this.parseSector(job),
      salary: this.parseSalary(job),
      skills: this.parseSkills($, job)
    };

    return jobData;
  }

  parseSector(job) {
    // job_sector에서 등록일 텍스트를 제외한 실제 직무 분야만 추출
    const sectorText = job.find('.job_sector').text().trim();
    // "등록일" 이전의 텍스트만 추출
    const sectorParts = sectorText.split('등록일');
    return sectorParts[0].trim();
  }

  parseSalary(job) {
    // 급여 정보는 area_job 클래스 내의 salary_info 클래스에서 찾음
    const salaryText = job.find('.salary_info').text().trim();
    if (salaryText) {
      return salaryText;
    }
    // 백업: area_badge에서 찾기
    return job.find('.area_badge .salary').text().trim() || '회사내규에 따름';
  }

  parseSkills($, job) {
    const skills = new Set(); // 중복 제거를 위해 Set 사용
    
    // 기술스택 정보가 있는 요소들을 찾아서 처리
    job.find('.job_sector span:not(.bar)').each((_, elem) => {
      const skill = $(elem).text().trim();
      if (skill && !skill.includes('등록일')) {
        skills.add(skill);
      }
    });

    // 추가적인 기술스택 정보가 있을 수 있는 다른 요소들도 확인
    job.find('.job_sector a').each((_, elem) => {
      const skill = $(elem).text().trim();
      if (skill) {
        skills.add(skill);
      }
    });

    return Array.from(skills);
  }
}
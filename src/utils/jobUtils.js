/**
 * 기술스택 문자열을 배열로 파싱
 */
export const parseSkills = (skillsString) => {
  if (!skillsString) return [];
  return skillsString.split(',').map(skill => skill.trim()).filter(Boolean);
};

/**
 * 경력 범위 파싱
 */
export const parseExperience = (expString) => {
  if (!expString) return null;
  const [min, max] = expString.split('-').map(Number);
  return {
    min: isNaN(min) ? 0 : min,
    max: isNaN(max) ? min : max
  };
};

/**
 * 급여 범위 파싱
 */
export const parseSalary = (salaryString) => {
  if (!salaryString) return null;
  const [min, max] = salaryString.split('-').map(Number);
  return {
    min: isNaN(min) ? 0 : min,
    max: isNaN(max) ? min : max
  };
};

/**
 * 정렬 옵션 생성
 */
export const createSortOption = (sort) => {
  switch (sort) {
    case 'salary':
      return { 'salary.min': -1 };
    case 'views':
      return { views: -1 };
    default:
      return { createdAt: -1 };
  }
};
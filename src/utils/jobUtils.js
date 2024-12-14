/**
 * 기술스택 문자열을 배열로 파싱
 */
export const parseSkills = (skillsString) => {
  if (!skillsString) return [];
  if (Array.isArray(skillsString)) return skillsString;
  
  return skillsString.split(',').map(skill => skill.trim()).filter(Boolean);
};

/**
 * 급여 문자열에서 숫자만 추출
 */
export const parseSalary = (salaryString) => {
  if (!salaryString) return null;
  const amount = parseInt(salaryString.replace(/[^0-9]/g, ''));
  return isNaN(amount) ? null : amount;
};

/**
 * 정렬 옵션 검증
 */
export const validateSortOption = (sort) => {
  const validOptions = ['latest', 'views'];
  return validOptions.includes(sort) ? sort : 'latest';
};
/**
 * 급여 텍스트를 파싱하여 구조화된 정보로 변환
 */
export const parseSalaryText = (text) => {
  // 기본값 설정
  let result = {
    min: null,
    max: null,
    isNegotiable: true
  };

  // 회사 내규인 경우
  if (text.includes('회사내규') || text.includes('협의')) {
    return result;
  }

  // 숫자 추출 (만 단위)
  const numbers = text.match(/\d+/g);
  if (!numbers) return result;

  // 연봉 범위 추출
  if (text.includes('연봉')) {
    const salary = numbers.map(num => parseInt(num) * 10000);
    if (salary.length >= 2) {
      result.min = salary[0];
      result.max = salary[1];
    } else if (salary.length === 1) {
      if (text.includes('이상')) {
        result.min = salary[0];
      } else if (text.includes('이하')) {
        result.max = salary[0];
      } else {
        result.min = salary[0];
        result.max = salary[0];
      }
    }
  }

  // 월급 범위 추출 (연봉으로 변환)
  else if (text.includes('월')) {
    const salary = numbers.map(num => parseInt(num) * 12);
    if (salary.length >= 2) {
      result.min = salary[0];
      result.max = salary[1];
    } else if (salary.length === 1) {
      if (text.includes('이상')) {
        result.min = salary[0];
      } else if (text.includes('이하')) {
        result.max = salary[0];
      } else {
        result.min = salary[0];
        result.max = salary[0];
      }
    }
  }

  result.isNegotiable = false;
  return result;
};

/**
 * 급여 정보를 포맷팅하여 표시
 */
export const formatSalary = (salary) => {
  if (salary.isNegotiable) {
    return '회사내규에 따름';
  }

  const formatNumber = (num) => {
    if (!num) return '';
    return (num / 10000).toFixed(0) + '만';
  };

  if (salary.min && salary.max) {
    if (salary.min === salary.max) {
      return `연봉 ${formatNumber(salary.min)}원`;
    }
    return `연봉 ${formatNumber(salary.min)}원 ~ ${formatNumber(salary.max)}원`;
  } else if (salary.min) {
    return `연봉 ${formatNumber(salary.min)}원 이상`;
  } else if (salary.max) {
    return `연봉 ${formatNumber(salary.max)}원 이하`;
  }

  return '회사내규에 따름';
};
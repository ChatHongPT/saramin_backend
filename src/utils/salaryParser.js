/**
 * 급여 정보 파싱 유틸리티
 */
export class SalaryParser {
  /**
   * 급여 텍스트에서 숫자 추출
   */
  static extractNumbers(text) {
    const numbers = text.match(/\d+(?:[,.]\d+)?/g);
    return numbers ? numbers.map(n => parseFloat(n.replace(/,/g, ''))) : [];
  }

  /**
   * 급여 단위 확인 (만원/연봉)
   */
  static getSalaryUnit(text) {
    if (text.includes('연봉')) return 'yearly';
    if (text.includes('월')) return 'monthly';
    return 'unknown';
  }

  /**
   * 급여 정보 파싱
   */
  static parse(text) {
    // 기본값 설정
    const result = {
      text: text?.trim() || '회사내규에 따름',
      min: null,
      max: null,
      isNegotiable: true,
      currency: 'KRW'
    };

    // 회사내규/협의인 경우
    if (!text || text.includes('회사내규') || text.includes('협의')) {
      return result;
    }

    const numbers = this.extractNumbers(text);
    const unit = this.getSalaryUnit(text);

    if (numbers.length === 0) return result;

    // 단위에 따른 변환
    const multiplier = unit === 'monthly' ? 12 : 1;
    const values = numbers.map(n => n * multiplier * 10000); // 만원 단위를 원 단위로 변환

    // 범위 설정
    if (values.length >= 2) {
      result.min = Math.min(...values);
      result.max = Math.max(...values);
    } else {
      if (text.includes('이상')) {
        result.min = values[0];
      } else if (text.includes('이하') || text.includes('까지')) {
        result.max = values[0];
      } else {
        result.min = values[0];
        result.max = values[0];
      }
    }

    result.isNegotiable = false;
    return result;
  }

  /**
   * 급여 정보 포맷팅
   */
  static format(salary) {
    if (salary.isNegotiable) return '회사내규에 따름';

    const formatAmount = (amount) => {
      if (!amount) return '';
      return `${(amount / 10000).toLocaleString()}만원`;
    };

    if (salary.min && salary.max) {
      if (salary.min === salary.max) {
        return `연봉 ${formatAmount(salary.min)}`;
      }
      return `연봉 ${formatAmount(salary.min)} ~ ${formatAmount(salary.max)}`;
    } else if (salary.min) {
      return `연봉 ${formatAmount(salary.min)} 이상`;
    } else if (salary.max) {
      return `연봉 ${formatAmount(salary.max)} 이하`;
    }

    return '회사내규에 따름';
  }
}
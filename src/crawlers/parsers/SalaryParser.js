export class SalaryParser {
  static parse(text) {
    // Default structure
    const result = {
      text: text?.trim() || '회사내규에 따름',
      min: null,
      max: null,
      isNegotiable: true,
      currency: 'KRW'
    };

    // Return default for negotiable cases
    if (!text || text.includes('회사내규') || text.includes('협의')) {
      return result;
    }

    // Extract numbers (handle both with and without commas)
    const numbers = text.match(/\d+(?:[,.]\d+)?/g);
    if (!numbers) return result;

    // Convert to actual numbers (assuming values are in 만원)
    const values = numbers.map(n => parseFloat(n.replace(/,/g, '')) * 10000);

    // Set salary range
    if (values.length >= 2) {
      result.min = Math.min(...values);
      result.max = Math.max(...values);
    } else if (values.length === 1) {
      if (text.includes('이상')) {
        result.min = values[0];
      } else if (text.includes('이하') || text.includes('까지')) {
        result.max = values[0];
      } else {
        result.min = values[0];
        result.max = values[0];
      }
    }

    // If we have any actual values, it's not negotiable
    if (result.min !== null || result.max !== null) {
      result.isNegotiable = false;
    }

    return result;
  }

  static format(salary) {
    if (salary.isNegotiable) {
      return '회사내규에 따름';
    }

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
import { parseSalaryText } from './salaryUtils.js';

export const createSearchFilters = (filters) => {
  const query = { status: 'active' };

  // Keyword search
  if (filters.keyword) {
    query.$or = [
      { title: new RegExp(filters.keyword, 'i') },
      { description: new RegExp(filters.keyword, 'i') }
    ];
  }

  // Company search
  if (filters.company) {
    query['company.name'] = new RegExp(filters.company, 'i');
  }

  // Location filter
  if (filters.location) {
    query.location = new RegExp(filters.location, 'i');
  }

  // Experience filter
  if (filters.experience) {
    const [min, max] = filters.experience.split('-').map(Number);
    if (!isNaN(min)) {
      query['experience.min'] = { $gte: min };
      if (!isNaN(max)) {
        query['experience.max'] = { $lte: max };
      }
    }
  }

  // Salary filter
  if (filters.salary) {
    const { min, max } = parseSalaryText(filters.salary);
    if (min) query['salary.min'] = { $gte: min };
    if (max) query['salary.max'] = { $lte: max };
  }

  // Skills filter
  if (filters.skills) {
    const skillsList = filters.skills.split(',').map(s => s.trim());
    if (skillsList.length > 0) {
      query['skills.name'] = { $in: skillsList };
    }
  }

  return query;
};

export const createSortOption = (sort) => {
  switch (sort) {
    case 'salary':
      return { 'salary.min': -1 };
    case 'views':
      return { views: -1 };
    case 'experience':
      return { 'experience.min': -1 };
    case 'latest':
    default:
      return { createdAt: -1 };
  }
};
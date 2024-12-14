export const createSearchFilters = (params) => {
  const filters = {};

  if (params.location) {
    filters.location = new RegExp(params.location, 'i');
  }

  if (params.experience) {
    filters['experience.required'] = new RegExp(params.experience, 'i');
  }

  if (params.type) {
    filters.type = params.type;
  }

  if (params.skills) {
    const skillsList = params.skills.split(',').map(s => s.trim());
    if (skillsList.length > 0) {
      filters['skills.name'] = { $in: skillsList };
    }
  }

  if (params.salary) {
    const [min, max] = params.salary.split('-').map(Number);
    if (!isNaN(min) || !isNaN(max)) {
      filters.salary = {};
      if (!isNaN(min)) filters.salary.$gte = min;
      if (!isNaN(max)) filters.salary.$lte = max;
    }
  }

  return filters;
};
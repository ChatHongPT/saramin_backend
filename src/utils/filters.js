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
    const skillsList = Array.isArray(params.skills) 
      ? params.skills 
      : params.skills.split(',').map(s => s.trim());
    
    if (skillsList.length > 0) {
      filters['skills.name'] = { $in: skillsList };
    }
  }

  return filters;
};
const { Op } = require('sequelize');
const ProjectAssignment = require('../models/ProjectAssignment');
const Bug = require('../models/Bug');
const { FEATURE_STATUSES, BUG_STATUSES } = require('../enums/Bug');

async function isUserAssignedToProject(userId, projectId, role) {
  return !!(await ProjectAssignment.findOne({ where: { user_id: userId, project_id: projectId, role } }));
}

function isValidStatusForType(type, status) {
  if (type === 'feature') return FEATURE_STATUSES.includes(status);
  if (type === 'bug') return BUG_STATUSES.includes(status);
  return false;
}

async function isBugTitleUniqueInProject(title, projectId, excludeBugId = null) {
  const where = { title, project_id: projectId };
  if (excludeBugId) where.id = { [Op.ne]: excludeBugId };
;
  const existing = await Bug.findOne({ where });
  return !existing;
}

function isQAorDeveloper(userType) {
  return ['QA', 'developer'].includes(userType);
}

module.exports = {
  isUserAssignedToProject,
  isValidStatusForType,
  isBugTitleUniqueInProject,
  isQAorDeveloper
}; 
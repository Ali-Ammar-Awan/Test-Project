const ProjectAssignment = require('../models/ProjectAssignment');
const User = require('../models/User');

async function getProjectAssignments(projectId) {
  const assignments = await ProjectAssignment.findAll({
    where: { project_id: projectId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'user_type']
      }
    ]
  });

  return assignments.map(assignment => ({
    user_id: assignment.user_id,
    role: assignment.role,
    user: assignment.user
  }));
}

module.exports = { getProjectAssignments }; 
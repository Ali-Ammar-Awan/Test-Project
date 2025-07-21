const Project = require('../models/Project');
const ProjectAssignment = require('../models/ProjectAssignment');
const User = require('../models/User');
const { ProjectUtils } = require('../utilities');
const Exception = require('../helpers/Exception');
const { ErrorCodes } = require('../constants');
const { ProjectConstants } = require('../constants');
const { FEATURE_STATUSES, BUG_STATUSES } = require('../enums/Bug');



class ProjectAssignmentHandler {

    static async delete(projectId){
    await ProjectAssignment.destroy({ where: { project_id: projectId } });
    }

    static async bulkcreation(assignmentData){
    await ProjectAssignment.bulkCreate (assignmentData);
    }

    static async getProjectIdsByUserAndRole(userId, role) {
    const assignments = await ProjectAssignment.findAll({ where: { user_id: userId, role } });
    return assignments.map(a => a.project_id);
  }

    static async isUserAssignedToProject(userId, projectId, role) {
    const assignment = await ProjectAssignment.findOne({
      where: {
        user_id: userId,
        project_id: projectId,
        role
      }
    });
    return !!assignment;
  }

  static async getProjectAssignments(projectId) {
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

}
module.exports = ProjectAssignmentHandler;
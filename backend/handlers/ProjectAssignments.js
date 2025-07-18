const Project = require('../models/Project');
const ProjectAssignment = require('../models/ProjectAssignment');
const User = require('../models/User');
const { getProjectAssignments } = require('../helpers/projectAssignmentHelper');
const { ProjectUtils } = require('../utilities');
const Exception = require('../helpers/Exception');
const { ErrorCodes } = require('../constants');
const { ProjectConstants } = require('../constants');



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

}
module.exports = ProjectAssignmentHandler;
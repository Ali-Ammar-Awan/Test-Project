const Project = require('../models/Project');
const ProjectAssignment = require('../models/ProjectAssignment');
const User = require('../models/User');
const { getProjectAssignments } = require('../helpers/projectAssignmentHelper');
const { ProjectUtils } = require('../utilities');
const Exception = require('../helpers/Exception');
const { ErrorCodes } = require('../constants');
const { ProjectConstants } = require('../constants');



class ProjectHandler {
  static createProject({ name, details, image, manager_id  }) {
    ProjectUtils.validateManagerId(manager_id);
    
    return Project.create({ name, details, image, manager_id });
  }

    static async _getManagerProjects(managerId) {
    return Project.findAll({ where: { manager_id: managerId } });
  }

    static async _getAssignedProjects(userId) {
    const assignments = await ProjectAssignment.findAll({ where: { user_id: userId } });
    const projectIds = assignments.map(a => a.project_id);
    return Project.findAll({ where: { id: projectIds } });
  }

  static async getProjectById(projectId){
    const project = await Project.findByPk(projectId);
    return project;
  }

  static async updateProject(project,updateData){
      return  await project.update(updateData);
  }

  static async deleteProjectById(projectId, managerId) {
    const project = this.getProjectById(projectId);
    if (!project || project.manager_id != managerId) {
      throw new Exception(ProjectConstants.MESSAGES.FAILED_FETCH, ErrorCodes.DOCUMENT_NOT_FOUND, { reportError: true }).toJson();
    }
    await Project.destroy({ where: { id: projectId } });
    return true;
  }

  static async assignUsersToProject(projectId, managerId, assignments) {
    const project = await this.getProjectById(projectId);

    if (!project || project.manager_id !== managerId) {
      throw new Exception(ProjectConstants.MESSAGES.FAILED_FETCH, ErrorCodes.DOCUMENT_NOT_FOUND, { reportError: true }).toJson();
    }
    if (!Array.isArray(assignments) || assignments.length === 0) {
      throw new Exception('Assignments must be a non-empty array', ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
    }
    for (const assignment of assignments) {
      if (!assignment.user_id || !assignment.role) {
        throw new Exception('Each assignment must have user_id and role', ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
      }
      if (!['QA', 'developer'].includes(assignment.role)) {
        throw new Exception('Role must be either QA or developer', ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
      }
    }
    const userIds = assignments.map(a => a.user_id);
    const users = await User.findAll({ where: { id: userIds } });
    if (users.length !== userIds.length) {
      throw new Exception('One or more users not found', ErrorCodes.DOCUMENT_NOT_FOUND, { reportError: true }).toJson();
    }
    for (const user of users) {
      if (!['QA', 'developer'].includes(user.user_type)) {
        throw new Exception(`User ${user.name} is not a QA or developer`, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
      }
    }
    await ProjectAssignment.destroy({ where: { project_id: projectId } });
    const assignmentData = assignments.map(assignment => ({
      project_id: projectId,
      user_id: assignment.user_id,
      role: assignment.role
    }));
    await ProjectAssignment.bulkCreate(assignmentData);
    const { getProjectAssignments } = require('../helpers/projectAssignmentHelper');
    return getProjectAssignments(projectId);
  }
}
module.exports = ProjectHandler;
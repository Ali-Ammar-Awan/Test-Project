const Project = require('../../models/Project');
const ProjectAssignment = require('../../models/ProjectAssignment');
const User = require('../../models/User');
const { getProjectAssignments } = require('../../helpers/projectAssignmentHelper');
const { ProjectHandler, UserHandler, ProjectAssignmentHandler } = require('../../handlers');
const { ProjectUtils } = require('../../utilities');
const Exception = require('../../helpers/Exception');
const ProjectConstants = require('../../constants/Project');
const ErrorCodes = require('../../constants/ErrorCodes');

class ProjectManager {
  static async createProject({ name, details, image, manager_id }) {
    if (!name) {
      throw new Exception(ProjectConstants.MESSAGES.MISSING_PROJECT_NAME, ErrorCodes.BAD_REQUEST);
    }
    return ProjectHandler.createProject({ name, details, image, manager_id });
  }

  static async getProjectsForUser(user) {
    if (ProjectUtils.validateUserType(user)) { // Assumes this utility checks for 'manager'
      return ProjectHandler._getManagerProjects(user.id);
    } else {
      return ProjectHandler._getAssignedProjects(user.id);
    }
  }

static async getProjectByIdForUser(projectId, user) {
  const project = await ProjectHandler.getProjectById(projectId);
    if (!project) {
      throw new Exception(ProjectConstants.MESSAGES.PROJECT_NOT_FOUND, ErrorCodes.DOCUMENT_NOT_FOUND);
    }

  if (ProjectUtils.validateUserType(user)) {
      if (project.manager_id !== user.id) {
        throw new Exception(ProjectConstants.MESSAGES.NOT_PROJECT_MANAGER, ErrorCodes.FORBIDDEN);
      }
    } else {
      const isAssigned = await ProjectAssignmentHandler.isUserAssignedToProject(user.id, projectId);
      if (!isAssigned) {
        throw new Exception(ProjectConstants.MESSAGES.DO_NOT_HAVE_ACCESS, ErrorCodes.FORBIDDEN);
      }
    }
    return project;
}

static async updateProjectById(projectId, managerId, updateData) {
  const project = await ProjectHandler.getProjectById(projectId);
    if (!project) {
      throw new Exception(ProjectConstants.MESSAGES.PROJECT_NOT_FOUND, ErrorCodes.DOCUMENT_NOT_FOUND);
    }
    if (project.manager_id !== managerId) {
      throw new Exception(ProjectConstants.MESSAGES.NOT_PROJECT_MANAGER, ErrorCodes.FORBIDDEN);
    }
    return ProjectHandler.updateProject(project, updateData);
  }

 static async deleteProjectById(projectId, managerId) {
    const project = await ProjectHandler.getProjectById(projectId);
    if (!project) {
      throw new Exception(ProjectConstants.MESSAGES.PROJECT_NOT_FOUND, ErrorCodes.DOCUMENT_NOT_FOUND);
    }
    if (project.manager_id !== managerId) {
      throw new Exception(ProjectConstants.MESSAGES.NOT_PROJECT_MANAGER, ErrorCodes.FORBIDDEN);
    }
    return ProjectHandler.deleteProjectById(projectId, managerId);
  }

static async assignUsersToProject(projectId, managerId, assignments) {
const project = await ProjectHandler.getProjectById(projectId);
    if (!project || project.manager_id !== managerId) {
      throw new Exception(ProjectConstants.MESSAGES.NOT_PROJECT_MANAGER, ErrorCodes.FORBIDDEN);
    }

    if (!Array.isArray(assignments) || assignments.length === 0) {
      throw new Exception(ProjectConstants.MESSAGES.ASSIGNMENT_INVALID, ErrorCodes.BAD_REQUEST);
    }

    for (const assignment of assignments) {
      if (!assignment.user_id || !assignment.role || !['QA', 'developer'].includes(assignment.role)) {
        throw new Exception(ProjectConstants.MESSAGES.ASSIGNMENT_INVALID, ErrorCodes.BAD_REQUEST);
      }
    }

    const userIds = assignments.map(a => a.user_id);
    const users = await UserHandler.findUserById(userIds);
    if (users.length !== userIds.length) {
      throw new Exception(ProjectConstants.MESSAGES.USER_NOT_FOUND_FOR_ASSIGNMENT, ErrorCodes.DOCUMENT_NOT_FOUND);
      }

    await ProjectAssignmentHandler.delete(projectId);
    const assignmentData = assignments.map(assignment => ({
      project_id: projectId,
      user_id: assignment.user_id,
      role: assignment.role
    }));
    await ProjectAssignmentHandler.bulkcreation(assignmentData);
   
    return getProjectAssignments(projectId);
  }

  static async getProjectAssignees(projectId, user) {
      const project = await ProjectHandler.getProjectById(projectId);
      if (!project) {
          throw new Exception(ProjectConstants.MESSAGES.PROJECT_NOT_FOUND, ErrorCodes.DOCUMENT_NOT_FOUND);
      }

      // Allow if manager OR assigned as QA
      const isManager = project.manager_id === user.id;
      const isQA = await ProjectAssignmentHandler.isUserAssignedToProject(user.id, projectId, 'QA');

      if (!isManager && !isQA) {
          throw new Exception(ProjectConstants.MESSAGES.DO_NOT_HAVE_ACCESS, ErrorCodes.FORBIDDEN);
      }

      return getProjectAssignments(projectId);
  }
}

module.exports = ProjectManager; 
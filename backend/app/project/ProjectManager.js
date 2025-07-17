const Project = require('../../models/Project');
const ProjectAssignment = require('../../models/ProjectAssignment');
const User = require('../../models/User');
const { getProjectAssignments } = require('../../helpers/projectAssignmentHelper');
const {ProjectHandler, UserHandler, ProjectAssignmentHandler}=require('../../handlers');
const { ProjectUtils } = require('../../utilities');
const {ErrorCodes} = require('../../constants')


class ProjectManager {
  static async createProject({ name, details, image, manager_id }) {
  const project = ProjectHandler.createProject({name, details, image, manager_id});
    return project;
  }

  static async getProjectsForUser(user) {
   if(ProjectUtils.validateUserType(user)){
      return  ProjectHandler._getManagerProjects(user.id);
    } else {
      return ProjectHandler._getAssignedProjects(user.id);
    }
  }


static async getProjectByIdForUser(projectId, user) {
  const project = await ProjectHandler.getProjectById(projectId);

  if (!project) return null;

  if (ProjectUtils.validateUserType(user)) {
    if (project.manager_id !== user.id) return null;
    return project;
  } else {
    return await ProjectHandler._getAssignedProjects(projectId); 
  }
}

static async updateProjectById(projectId, managerId, updateData) {
  const project = await ProjectHandler.getProjectById(projectId);

  if (!project || project.manager_id !== managerId) {
    return null;
  }

  const updatedProject = await ProjectHandler.updateProject(project, updateData);
  return updatedProject;
}
 static async deleteProjectById(projectId, managerId) {
  try {
      const project = ProjectHandler.getProjectById(projectId);
    if (!project || project.manager_id != managerId) {
      throw new Exception(ProjectConstants.MESSAGES.FAILED_FETCH, ErrorCodes.DOCUMENT_NOT_FOUND, { reportError: true }).toJson();
    }
    return await ProjectHandler.deleteProjectById(projectId, managerId);
  } catch (err) {
    console.error('Error deleting project:', err);
    return null;
  }
}


static async assignUsersToProject(projectId, managerId, assignments) {

const project = await ProjectHandler.getProjectById(projectId);

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

     const users =await UserHandler.findUserById(userIds);
    if (users.length !== userIds.length) {
      throw new Exception('One or more users not found', ErrorCodes.DOCUMENT_NOT_FOUND, { reportError: true }).toJson();
    }
    for (const user of users) {
      if (!['QA', 'developer'].includes(user.user_type)) {
        throw new Exception(`User ${user.name} is not a QA or developer`, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();
      }
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
}

module.exports = ProjectManager; 
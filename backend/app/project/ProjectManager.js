const Project = require('../../models/Project');
const ProjectAssignment = require('../../models/ProjectAssignment');
const User = require('../../models/User');
const { getProjectAssignments } = require('../../helpers/projectAssignmentHelper');
const {ProjectHandler}=require('../../handlers');
const { ProjectUtils } = require('../../utilities');


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
    return await ProjectHandler.deleteProjectById(projectId, managerId);
  } catch (err) {
    console.error('Error deleting project:', err);
    return null;
  }
}


  static async assignUsersToProject(projectId, managerId, assignments) {
    try {
      return await ProjectHandler.assignUsersToProject(projectId, managerId, assignments);
    } catch (err) {
    console.error('Error assigning users:', err);
    throw err;
  }
  }
}

module.exports = ProjectManager; 
const Project = require('../models/Project');
const ProjectAssignment = require('../models/ProjectAssignment');
const User = require('../models/User');
const { getProjectAssignments } = require('../helpers/projectAssignmentHelper');
const { ProjectUtils } = require('../utilities');




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
}
module.exports = ProjectHandler;
const Project = require('../../models/Project');
const ProjectAssignment = require('../../models/ProjectAssignment');


class ProjectManager {
  static async createProject({ name, manager_id }) {
    return Project.create({ name, manager_id });
  }

  static async getProjectsForUser(user) {
    if (user.user_type === 'manager') {

      return this._getManagerProjects(user.id);
    } else {
      return this._getAssignedProjects(user.id);
    }
  }

  static async _getManagerProjects(managerId) {
    return Project.findAll({ where: { manager_id: managerId } });
  }

  static async _getAssignedProjects(userId) {
    const assignments = await ProjectAssignment.findAll({ where: { user_id: userId } });
    const projectIds = assignments.map(a => a.project_id);
    return Project.findAll({ where: { id: projectIds } });
  }

  static async getProjectByIdForUser(projectId, user) {
    const project = await Project.findByPk(projectId);
    if (!project) return null;
    if (user.user_type === 'manager') {
      if (project.manager_id !== user.id) return null;
      return project;
    } else {
      const assignment = await ProjectAssignment.findOne({ where: { user_id: user.id, project_id: projectId } });
      if (!assignment) return null;
      return project;
    }
  }

  static async updateProjectById(projectId, managerId, updateData) {
    const project = await Project.findByPk(projectId);
    if (!project || project.manager_id !== managerId) {
      return null;
    }
    await project.update(updateData);
    return project;
  }
}

module.exports = ProjectManager; 
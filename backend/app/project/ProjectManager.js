const Project = require('../../models/Project');
const ProjectAssignment = require('../../models/ProjectAssignment');
const User = require('../../models/User');
const { getProjectAssignments } = require('../../helpers/projectAssignmentHelper');


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
  static async deleteProjectById(projectId,managerId){
    const project = await Project.findByPk(projectId);
    if(!project || project.manager_id != managerId){
        return null;
    }
    await Project.destroy({where:{id:projectId}});
    return true;
  }

  static async assignUsersToProject(projectId, managerId, assignments) {
    const project = await Project.findByPk(projectId);
    if (!project || project.manager_id !== managerId) {
      throw new Error('Project not found or access denied');
    }

    if (!Array.isArray(assignments) || assignments.length === 0) {
      throw new Error('Assignments must be a non-empty array');
    }

  
    for (const assignment of assignments) {
      if (!assignment.user_id || !assignment.role) {
        throw new Error('Each assignment must have user_id and role');
      }
      if (!['QA', 'developer'].includes(assignment.role)) {
        throw new Error('Role must be either QA or developer');
      }
    }

    
    const userIds = assignments.map(a => a.user_id);
    const users = await User.findAll({ where: { id: userIds } });
    
    if (users.length !== userIds.length) {
      throw new Error('One or more users not found');
    }

   
    for (const user of users) {
      if (!['QA', 'developer'].includes(user.user_type)) {
        throw new Error(`User ${user.name} is not a QA or developer`);
      }
    }

    await ProjectAssignment.destroy({ where: { project_id: projectId } });

    
    const assignmentData = assignments.map(assignment => ({
      project_id: projectId,
      user_id: assignment.user_id,
      role: assignment.role
    }));

    await ProjectAssignment.bulkCreate(assignmentData);

    
    return getProjectAssignments(projectId);
  }
}

module.exports = ProjectManager; 
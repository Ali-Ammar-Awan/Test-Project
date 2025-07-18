const Bug = require('../../models/Bug');
const ProjectAssignment = require('../../models/ProjectAssignment');
const User = require('../../models/User');
const Project = require('../../models/Project');
const { BUG_TYPES } = require('../../enums/Bug');
const { isUserAssignedToProject, isValidStatusForType, isBugTitleUniqueInProject } = require('../../helpers/assignmentHelper');
const {BugHandler,ProjectHandler,ProjectAssignmentHandler} = require('../../handlers');
const {AuthUtils} = require ('../../utilities')

class BugManager {
  static async createBug({ title, description, deadline, screenshot, type, status, project_id, developer_id, qa_id }) {
    if (!title || !type || !status || !project_id || !developer_id || !qa_id) {
      throw new Error('Missing required fields');
    }
    if (!BUG_TYPES.includes(type)) {
      throw new Error('Invalid bug type');
    }
    if (!isValidStatusForType(type, status)) {
      throw new Error('Invalid status for ' + type);
    }
    if (screenshot && !screenshot.match(/\.(png|gif)$/i)) {
      throw new Error('Screenshot must be a PNG or GIF image');
    }
    if (!(await isUserAssignedToProject(qa_id, project_id, 'QA'))) {
      throw new Error('QA is not assigned to this project');
    }
    if (!(await isUserAssignedToProject(developer_id, project_id, 'developer'))) {
      throw new Error('Developer is not assigned to this project');
    }
    if (!(await isBugTitleUniqueInProject(title, project_id))) {
      throw new Error('Bug title must be unique within the project');
    }
    const bug = await BugHandler.createBug({ title, description, deadline, screenshot, type, status, project_id, developer_id, qa_id });
    return bug;
  }

  static async listBugs(user, filters = {}) {
    const { project_id, status } = filters;
    let projectIds = [];

    if (user.user_type === 'manager') {
      projectIds = await ProjectHandler.getProjectIdsByManager(user.id);
    } else if (user.user_type === 'QA') {
      projectIds = await ProjectAssignmentHandler.getProjectIdsByUserAndRole(user.id, 'QA');
    } else if (user.user_type === 'developer') {
      projectIds = await ProjectAssignmentHandler.getProjectIdsByUserAndRole(user.id, 'developer');
    }

    return BugHandler.getBugs(user, project_id, status, projectIds);
  }

   static async getBugById(user, bugId) {
    const bug = await BugHandler.findBugWithDetails(bugId);
    if (!bug) return null;

    if (user.user_type === 'manager') {
      const isManager = ProjectHandler.isProjectManager(bug.Project, user.id);
      if (!isManager) return null;
    } else if (user.user_type === 'QA') {
      const isAssignedQA = await ProjectAssignmentHandler.isUserAssignedToProject(user.id, bug.project_id, 'QA');
      if (!isAssignedQA) return null;
    } else if (user.user_type === 'developer') {
      const isAssignedDev = await ProjectAssignmentHandler.isUserAssignedToProject(user.id, bug.project_id, 'developer');
      const isBugOwner = bug.developer_id === user.id;
      if (!isAssignedDev && !isBugOwner) return null;
    }

    return bug;
  }

  static async updateBug(user, bugId, updateData, file) {
const bug = await BugHandler.findBugById(bugId);

if (AuthUtils.isManager(user)) {
  const project = await ProjectHandler.getProjectById(bug.project_id);
      if (!project || project.manager_id !== user.id) throw new Error('Access denied');
    } else if (user.user_type === 'QA') {
      if (!(await isUserAssignedToProject(user.id, bug.project_id, 'QA'))) throw new Error('Access denied');
    } else if (user.user_type === 'developer') {
      if (bug.developer_id !== user.id) throw new Error('Access denied');
    } else {
      throw new Error('Access denied');
    }
    let allowedFields = [];
    if (user.user_type === 'manager') {
      allowedFields = ['title', 'description', 'deadline', 'type', 'status', 'screenshot', 'developer_id'];
    } else if (user.user_type === 'QA') {
      allowedFields = ['title', 'description', 'deadline', 'type', 'status', 'screenshot'];
    } else if (user.user_type === 'developer') {
      allowedFields = ['status'];
    }
    const updates = {};
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        updates[key] = updateData[key];
      }
    }
    if (file) {
      if (!file.filename.match(/\.(png|gif)$/i)) {
        throw new Error('Screenshot must be a PNG or GIF image');
      }
      updates.screenshot = file.filename;
    }
    const type = updates.type || bug.type;
    const status = updates.status || bug.status;
    if (!isValidStatusForType(type, status)) {
      throw new Error('Invalid status for ' + type);
    }
    if (updates.title && updates.title !== bug.title) {
      if (!(await isBugTitleUniqueInProject(updates.title, bug.project_id, bug.id))) {
        throw new Error('Bug title must be unique within the project');
      }
    }
    if (updates.developer_id && updates.developer_id !== bug.developer_id) {
      if (!(await isUserAssignedToProject(updates.developer_id, bug.project_id, 'developer'))) {
        throw new Error('Developer is not assigned to this project');
      }
    }
    await bug.update(updates);
    return bug;
  }

  static async deleteBug(user, bugId) {
   const bug = await BugHandler.findBugById(bugId);
    if (!bug) throw new Error('Bug not found');

    if (AuthUtils.isManager(user)) {
     const project = await ProjectHandler.getProjectById(bug.project_id);
      if (!project || project.manager_id !== user.id) throw new Error('Access denied');
    } else if (user.user_type === 'QA') {
      if (!(await isUserAssignedToProject(user.id, bug.project_id, 'QA'))) throw new Error('Access denied');
    } else {
      throw new Error('Access denied');
    }
    await bug.destroy();
    return true;
  }
}

module.exports = BugManager; 
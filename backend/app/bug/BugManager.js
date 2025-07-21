const { BUG_TYPES } = require('../../enums/Bug');
const {isValidStatusForType} = require('../../helpers/Validators');
const { BugHandler, ProjectHandler, ProjectAssignmentHandler } = require('../../handlers');
const { AuthUtils } = require('../../utilities');
const Exception = require('../../helpers/Exception');
const BugConstants = require('../../constants/Bugs');
const ErrorCodes = require('../../constants/ErrorCodes');
const {UserHandler} = require('../../handlers')
const { FEATURE_STATUSES, BUG_STATUSES } = require('../../enums/Bug');
class BugManager {
  static async createBug({ title, description, deadline, screenshot, type, status, project_id, developer_id, qa_id }) {
    if (!title || !type || !status || !project_id || !developer_id || !qa_id) {
      throw new Exception(BugConstants.MESSAGES.MISSING_FIELDS, ErrorCodes.BAD_REQUEST);
    }
    if (!BUG_TYPES.includes(type)) {
      throw new Exception(BugConstants.MESSAGES.INVALID_BUG_TYPE, ErrorCodes.UNPROCESSABLE_ENTITY);
    }
    if (!isValidStatusForType(type, status)) {
      throw new Exception(BugConstants.MESSAGES.INVALID_STATUS, ErrorCodes.UNPROCESSABLE_ENTITY);
    }
    if (screenshot && !screenshot.match(/\.(png|gif)$/i)) {
      throw new Exception(BugConstants.MESSAGES.INVALID_SCREENSHOT, ErrorCodes.BAD_REQUEST);
    }
    if (!(await ProjectAssignmentHandler.isUserAssignedToProject(qa_id, project_id, 'QA'))) {
      throw new Exception(BugConstants.MESSAGES.QA_NOT_ASSIGNED, ErrorCodes.FORBIDDEN);
    }
    if (!(await ProjectAssignmentHandler.isUserAssignedToProject(developer_id, project_id, 'developer'))) {
      throw new Exception(BugConstants.MESSAGES.DEVELOPER_NOT_ASSIGNED, ErrorCodes.FORBIDDEN);
    }
    if (!(await BugHandler.isBugTitleUniqueInProject(title, project_id))) {
      throw new Exception(BugConstants.MESSAGES.BUG_TITLE_NOT_UNIQUE, ErrorCodes.CONFLICT_WITH_CURRENT_STATE);
    }

    return BugHandler.createBug({ title, description, deadline, screenshot, type, status, project_id, developer_id, qa_id });
  }

  static async listBugs(user, filters = {}) {
    const { project_id, status } = filters;
    let projectIds = [];

    if (user.user_type === 'manager') {
      projectIds = await ProjectHandler.getProjectIdsByManager(user.id);
    } else {
      projectIds = await ProjectAssignmentHandler.getProjectIdsByUserAndRole(user.id, user.user_type);
    }

    return BugHandler.getBugs(user, project_id, status, projectIds);
  }

   static async getBugById(user, bugId) {
    const bug = await BugHandler.findBugWithDetails(bugId);
    if (!bug) {
      throw new Exception(BugConstants.MESSAGES.BUG_NOT_FOUND, ErrorCodes.DOCUMENT_NOT_FOUND);
    }

    if (user.user_type === 'manager') {
      if (bug.Project.manager_id !== user.id) {
        throw new Exception(BugConstants.MESSAGES.ACCESS_DENIED, ErrorCodes.FORBIDDEN);
      }
    } else {
      const isAssigned = await ProjectAssignmentHandler.isUserAssignedToProject(user.id, bug.project_id, user.user_type);
      if (!isAssigned) {
        throw new Exception(BugConstants.MESSAGES.ACCESS_DENIED, ErrorCodes.FORBIDDEN);
    }
    }
    return bug;
  }

  static async updateBug(user, bugId, updateData, file) {
const bug = await BugHandler.findBugById(bugId);
    if (!bug) {
        throw new Exception(BugConstants.MESSAGES.BUG_NOT_FOUND, ErrorCodes.DOCUMENT_NOT_FOUND);
    }

    // Authorization Check
    const canUpdate = (AuthUtils.isManager(user) && bug.Project.manager_id === user.id) ||
                      (user.user_type === 'QA' && await ProjectAssignmentHandler.isUserAssignedToProject(user.id, bug.project_id, 'QA')) ||
                      (user.user_type === 'developer' && bug.developer_id === user.id);

    if (!canUpdate) {
      throw new Exception(BugConstants.MESSAGES.ACCESS_DENIED, ErrorCodes.FORBIDDEN);
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
      updates.screenshot = file.filename;
    }

    // Validation for updates
    if (updates.type || updates.status) {
    const type = updates.type || bug.type;
    const status = updates.status || bug.status;
    if (!isValidStatusForType(type, status)) {
          throw new Exception(BugConstants.MESSAGES.INVALID_STATUS, ErrorCodes.UNPROCESSABLE_ENTITY);
        }
    }
    
    if (updates.title && updates.title !== bug.title) {
      if (!(await BugHandler.isBugTitleUniqueInProject(updates.title, bug.project_id, bug.id))) {
        throw new Exception(BugConstants.MESSAGES.BUG_TITLE_NOT_UNIQUE, ErrorCodes.CONFLICT_WITH_CURRENT_STATE);
      }
    }
    if (updates.developer_id && updates.developer_id !== bug.developer_id) {
      if (!(await UserHandler.isUserAssignedToProject(updates.developer_id, bug.project_id, 'developer'))) {
        throw new Exception(BugConstants.MESSAGES.DEVELOPER_NOT_ASSIGNED, ErrorCodes.FORBIDDEN);
      }
    }
    
    await bug.update(updates);
    return bug;
  }

  static async deleteBug(user, bugId) {
   const bug = await BugHandler.findBugById(bugId);
    if (!bug) {
      throw new Exception(BugConstants.MESSAGES.BUG_NOT_FOUND, ErrorCodes.DOCUMENT_NOT_FOUND);
    }

    const canDelete = (AuthUtils.isManager(user) && bug.Project.manager_id === user.id) ||
                      (user.user_type === 'QA' && await UserHandler.isUserAssignedToProject(user.id, bug.project_id, 'QA'));
    
    if (!canDelete) {
      throw new Exception(BugConstants.MESSAGES.ACCESS_DENIED, ErrorCodes.FORBIDDEN);
    }

    await bug.destroy();
    return true;
  }
}

module.exports = BugManager; 
const ProjectManager = require('./ProjectManager');
const ProjectConstants = require('../../constants/Project');
const ErrorCodes = require('../../constants/ErrorCodes');

class ProjectController {
  static async create(req, res) {
    try {
      const { name, details } = req.body;
      const image = req.file ? req.file.filename : null;
      const project = await ProjectManager.createProject({ name, details, image, manager_id: req.user.id });
      res.status(ErrorCodes.SUCCESS).json({ success: true, data: project });
    } catch (err) {
      res.status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        code: err.code || ErrorCodes.INTERNAL_SERVER_ERROR,
        message: err.message || ProjectConstants.MESSAGES.CREATING_PROJECT_FAILED
      });
    }
  }

  static async list(req, res) {
    try {
      const projects = await ProjectManager.getProjectsForUser(req.user);
      res.status(ErrorCodes.SUCCESS).json({ success: true, projects });
    } catch (err) {
      res.status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        code: err.code || ErrorCodes.INTERNAL_SERVER_ERROR,
        message: err.message || ProjectConstants.MESSAGES.FAILED_FETCH
      });
    }
  }

  static async getById(req, res) {
    try {
      const project = await ProjectManager.getProjectByIdForUser(req.params.id, req.user);
      res.status(ErrorCodes.SUCCESS).json({ success: true, project });
    } catch (err) {
      res.status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        code: err.code || ErrorCodes.INTERNAL_SERVER_ERROR,
        message: err.message || ProjectConstants.MESSAGES.FAILED_FETCH
      });
    }
  }

  static async update(req, res) {
    try {
      const project = await ProjectManager.updateProjectById(req.params.id, req.user.id, req.body);
      res.status(ErrorCodes.SUCCESS).json({ success: true, message: ProjectConstants.MESSAGES.SUCCESSFUL_UPDATE, project });
    } catch (err) {
      res.status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        code: err.code || ErrorCodes.INTERNAL_SERVER_ERROR,
        message: err.message || ProjectConstants.MESSAGES.UNSUCCESSFUL_UPDATE
      });
    }
  }

  static async delete(req, res) {
    try {
      await ProjectManager.deleteProjectById(req.params.id, req.user.id);
      res.status(ErrorCodes.SUCCESS).json({ success: true, message: ProjectConstants.MESSAGES.PROJECT_DELETED });
    } catch (err) {
      res.status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        code: err.code || ErrorCodes.INTERNAL_SERVER_ERROR,
        message: err.message || ProjectConstants.MESSAGES.FAILED_DELETE
      });
    }
  }

  static async assignUsers(req, res) {
    try {
      const result = await ProjectManager.assignUsersToProject(req.params.id, req.user.id, req.body.assignments);
      res.status(ErrorCodes.SUCCESS).json({ success: true, message: ProjectConstants.MESSAGES.USERS_ASSIGNED, data: result });
    } catch (err) {
      res.status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        code: err.code || ErrorCodes.INTERNAL_SERVER_ERROR,
        message: err.message || ProjectConstants.MESSAGES.FAILED_ASSIGN
      });
    }
  }

  static async getAssignees(req, res) {
    try {
      const assignees = await ProjectManager.getProjectAssignees(req.params.id, req.user);
      res.status(ErrorCodes.SUCCESS).json({ success: true, data: assignees });
    } catch (err) {
      res.status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        code: err.code || ErrorCodes.INTERNAL_SERVER_ERROR,
        message: err.message || ProjectConstants.MESSAGES.FAILED_FETCH_ASSIGNEES
      });
    }
  }
}

module.exports = ProjectController; 
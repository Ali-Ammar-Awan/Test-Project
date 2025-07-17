const ProjectManager = require('./ProjectManager');
const { getProjectAssignments } = require('../../helpers/projectAssignmentHelper');
const assignments = require('../../models/ProjectAssignment');
const User = require('../../models/User');
const {ProjectConstants}=require('../../constants')
const Validators = require('../../helpers/Validators');
const ErrorCodes = require('../../constants/ErrorCodes');


class ProjectController {
  static async create(req, res) {
    try {
      const { name, details } = req.body;
      const manager_id = req.user.id;
      const image = req.file ? req.file.filename : null;
      const project = await ProjectManager.createProject({ name, details, image, manager_id });
      res.json({ success: true, data: project });
    } catch (err) {
      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : ProjectConstants.MESSAGES.CREATING_PROJECT_FAILED
      });
    }
  }

  static async list(req, res) {
    try {
      const projects = await ProjectManager.getProjectsForUser(req.user);
      res.json({ projects });
    } catch (err) {
      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : ProjectConstants.MESSAGES.FAILED_FETCH
      });
    }
  }

  static async getById(req, res) {
    try {
      const projectId = req.params.id;
      const project = await ProjectManager.getProjectByIdForUser(projectId, req.user);
      res.json({ project });
    } catch (err) {
      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : ProjectConstants.MESSAGES.FAILED_FETCH
      });
    }
  }

  static async update(req, res) {
    try {
      const projectId = req.params.id;
      const managerId = req.user.id;
      const updateData = req.body;
      const project = await ProjectManager.updateProjectById(projectId, managerId, updateData);
     
      res.json({ message:ProjectConstants.MESSAGES.SUCCESSFUL_UPDATE, project });
    } catch (err) {
      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : ProjectConstants.MESSAGES.UNSUCCESSFUL_UPDATE
      });
    }
  }
  static async delete(req, res) {
    try {
      const projectId = req.params.id;
      const managerId = req.user.id;
      await ProjectManager.deleteProjectById(projectId, managerId);
      return res.json({
        success: true,
        message: ProjectConstants.MESSAGES.PROJECT_DELETED || 'Project deleted successfully'
      });
    } catch (err) {
      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : ProjectConstants.MESSAGES.FAILED_DELETE
      });
    }
  }

  static async assignUsers(req, res) {
    try {
      const projectId = req.params.id;
      const managerId = req.user.id;
      const { assignments } = req.body;
      if (!assignments) {
        return json({ success: false, message: 'Assignments data is required' });
      }
      const result = await ProjectManager.assignUsersToProject(projectId, managerId, assignments);
      return res.json({
        success: true,
        message: ProjectConstants.MESSAGES.USERS_ASSIGNED || 'Users assigned to project successfully',
        data: result
      });
    } catch (err) {
      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : ProjectConstants.MESSAGES.FAILED_ASSIGN
      });
    }
  }

  static async getAssignees(req, res) {
    try {
      const projectId = req.params.id;
      const assignees = await getProjectAssignments(projectId);
      return res.status(200).json({
        success: true,
        data: assignees
      });
    } catch (err) {
      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : ProjectConstants.MESSAGES.FAILED_FETCH_ASSIGNES
      });
    }
  }
}

module.exports = ProjectController; 
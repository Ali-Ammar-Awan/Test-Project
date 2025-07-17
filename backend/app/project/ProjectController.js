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
      // if (!project) {
      //   return res.status(404).json({ error: 'Project not found or access denied' });
      // }
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
      if (!project) {
        return res.status(404).json({ error: 'Project not found or access denied' });
      }
      res.status(200).json({ message: 'Project updated successfully', project });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update project', details: err.message });
    }
  }
  static async delete(req,res){
    try{
        const  projectId = req.params.id;
        const managerId = req.user.id;
        const project = await ProjectManager.deleteProjectById(projectId,managerId);
        if(!project){
            return res.status(404).json({error: 'Project not found or access denied'});
        }
        res.status(200).json({message: 'Project deleted successfully'});
    }
    catch(err){
        res.status(500).json({error: 'Failed to delete project ', details: err.message});
    }
  }

  static async assignUsers(req, res) {
    try {
      const projectId = req.params.id;
      const managerId = req.user.id;
      const { assignments } = req.body;

      if (!assignments) {
        return res.status(400).json({ error: 'Assignments data is required' });
      }

      const result = await ProjectManager.assignUsersToProject(projectId, managerId, assignments);
      res.status(200).json({ 
        message: 'Users assigned to project successfully', 
        assignments: result 
      });
    } catch (err) {
      if (err.message.includes('Project not found') || err.message.includes('access denied')) {
        return res.status(404).json({ error: err.message });
      }
      if (err.message.includes('must be') || err.message.includes('not found')) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Failed to assign users to project', details: err.message });
    }
  }

  static async getAssignees(req, res) {
    try {
      const projectId = req.params.id;
      const assignees = await getProjectAssignments(projectId);
      res.status(200).json({ assignees });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch assignees', details: err.message });
    }
  }
}

module.exports = ProjectController; 
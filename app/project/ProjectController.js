const ProjectManager = require('./ProjectManager');

class ProjectController {
  static async create(req, res) {
    try {
      const { name } = req.body;
      const manager_id = req.user.id;
      const project = await ProjectManager.createProject({ name, manager_id });
      res.status(201).json({ message: 'Project created successfully', project });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create project', details: err.message });
    }
  }

  static async list(req, res) {
    try {
      const projects = await ProjectManager.getProjectsForUser(req.user);
      res.status(200).json({ projects });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const projectId = req.params.id;
      const project = await ProjectManager.getProjectByIdForUser(projectId, req.user);
      if (!project) {
        return res.status(404).json({ error: 'Project not found or access denied' });
      }
      res.status(200).json({ project });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch project', details: err.message });
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
}

module.exports = ProjectController; 
const { BugConstant, ErrorCodes } = require('../../constants');
const BugManager = require('./BugManager');

class BugController {
  static async create(req, res) {
    try {
      const { title, description, deadline, type, status, project_id, developer_id } = req.body;
      const screenshot = req.file ? req.file.filename : undefined;
      const qa_id = req.user.id;
      const bug = await BugManager.createBug({
        title,
        description,
        deadline,
        screenshot,
        type,
        status,
        project_id,
        developer_id,
        qa_id
      });
      res.json({ message: BugConstant.MESSAGES.CREATE_SUCCESS , bug });
    }catch (err) {
      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : BugConstant.MESSAGES.ERROR_CREATING
      });
    }
  }

  static async list(req, res) {
    try {
      const filters = {
        project_id: req.query.project_id,
        status: req.query.status
      };
      const bugs = await BugManager.listBugs(req.user, filters);
      res.status(200).json({ bugs });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const bug = await BugManager.getBugById(req.user, req.params.id);
      if (!bug) {
        return res.status(404).json({ error: 'Bug not found or access denied' });
      }
      res.status(200).json({ bug });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const bug = await BugManager.updateBug(req.user, req.params.id, req.body, req.file);
      res.status(200).json({ message: 'Bug updated successfully', bug });
    } catch (err) {
      if (err.message === 'Bug not found') {
        return res.status(404).json({ error: err.message });
      }
      res.status(400).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      await BugManager.deleteBug(req.user, req.params.id);
      res.status(200).json({ message: 'Bug deleted successfully' });
    } catch (err) {
      if (err.message === 'Bug not found') {
        return res.status(404).json({ error: err.message });
      }
      res.status(403).json({ error: err.message });
    }
  }
}

module.exports = BugController; 
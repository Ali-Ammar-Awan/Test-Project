const { BugConstant, ErrorCodes } = require('../../constants');
const BugManager = require('./BugManager');
const Validators = require('../../helpers/Validators');

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
      res.status(Validators.validateCode(ErrorCodes.SUCCESS, ErrorCodes.SUCCESS)) .json({ bugs });
    } catch (err) {
      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : BugConstant.MESSAGES.ERROR_CREATING
      });
    }
  }

  static async getById(req, res) {
    try {
      const bug = await BugManager.getBugById(req.user, req.params.id);
      if (!bug) {
        return res.json({ error: 'Bug not found or access denied' });
      }
      res.status(Validators.validateCode(ErrorCodes.SUCCESS, ErrorCodes.SUCCESS)) .json({ bugs });
    }  catch (err) {
      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : BugConstant.MESSAGES.ERROR_FETCHING
      });
    }
  }

  static async update(req, res) {
    try {
      const bug = await BugManager.updateBug(req.user, req.params.id, req.body, req.file);
      res.json({ message: 'Bug updated successfully', bug });
    } catch (err) {
      return res.status(Validators.validateCode(err.message, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : BugConstant.MESSAGES.ERROR_UPDATING
      });
    }
  }

  static async delete(req, res) {
    try {
      await BugManager.deleteBug(req.user, req.params.id);
      res.json({ message: 'Bug deleted successfully' });
    } catch (err) {
      return res.status(Validators.validateCode(err.message, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : BugConstant.MESSAGES.ERROR_DELETING
      });
    }
  }
}

module.exports = BugController; 
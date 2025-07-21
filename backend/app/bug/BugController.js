const BugConstants = require('../../constants/Bugs');
const ErrorCodes = require('../../constants/ErrorCodes');
const BugManager = require('./BugManager');

class BugController {
  static async create(req, res) {
    try {
      const bugData = { ...req.body, screenshot: req.file ? req.file.filename : undefined, qa_id: req.user.id };
      const bug = await BugManager.createBug(bugData);
      res.status(ErrorCodes.SUCCESS).json({ success: true, message: BugConstants.MESSAGES.CREATE_SUCCESS, bug });
    } catch (err) {
      res.status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        code: err.code || ErrorCodes.INTERNAL_SERVER_ERROR,
        message: err.message || BugConstants.MESSAGES.ERROR_CREATING
      });
    }
  }

  static async list(req, res) {
    try {
      const bugs = await BugManager.listBugs(req.user, req.query);
      res.status(ErrorCodes.SUCCESS).json({ success: true, bugs });
    } catch (err) {
      res.status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        code: err.code || ErrorCodes.INTERNAL_SERVER_ERROR,
        message: err.message || BugConstants.MESSAGES.ERROR_LISTING
      });
    }
  }

  static async getById(req, res) {
    try {
      const bug = await BugManager.getBugById(req.user, req.params.id);
      res.status(ErrorCodes.SUCCESS).json({ success: true, bug });
    } catch (err) {
      res.status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        code: err.code || ErrorCodes.INTERNAL_SERVER_ERROR,
        message: err.message || BugConstants.MESSAGES.ERROR_FETCHING
      });
    }
  }

  static async update(req, res) {
    try {
      const bug = await BugManager.updateBug(req.user, req.params.id, req.body, req.file);
      res.status(ErrorCodes.SUCCESS).json({ success: true, message: BugConstants.MESSAGES.UPDATE_SUCCESS, bug });
    } catch (err) {
      res.status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        code: err.code || ErrorCodes.INTERNAL_SERVER_ERROR,
        message: err.message || BugConstants.MESSAGES.ERROR_UPDATING
      });
    }
  }

  static async delete(req, res) {
    try {
      await BugManager.deleteBug(req.user, req.params.id);
      res.status(ErrorCodes.SUCCESS).json({ success: true, message: BugConstants.MESSAGES.DELETE_SUCCESS });
    } catch (err) {
      res.status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        code: err.code || ErrorCodes.INTERNAL_SERVER_ERROR,
        message: err.message || BugConstants.MESSAGES.ERROR_DELETING
      });
    }
  }
}

module.exports = BugController; 
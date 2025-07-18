const UserManager = require('./UserManager');
const Validators=require('../../helpers/Validators');

class UserController {


  static async getUsers(req, res) {
    try {
      const users = await UserManager.getUsersForAssignment();
      res.json({ 
        success:true,
        data:users
      });
    } catch (err) {

      console.log(`getUser:: Request to fetch user failed. userId:: ${req.user.id} user:: ${req.user.email} params:: ${JSON.stringify(req.params)}`, err);

      return res.status(Validators.validateCode(err.code, ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.reportError ? err.message : UserConstants.MESSAGES.FETCHING_USER_FAILED
      });

    }
  }
}

module.exports = UserController;

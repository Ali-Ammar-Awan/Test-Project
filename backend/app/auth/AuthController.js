const { UserConstants } = require('../../constants');
const ErrorCodes = require('../../constants/ErrorCodes');
const Validators = require('../../helpers/Validators');
const AuthManager = require('./AuthManager');

class AuthController {
  static async login(req, res) {
    try {
      const { token, user } = await AuthManager.loginUser(req.body);

      res.json({
        success:true,
        data:user,
        token:token,
      });
    } catch (err) {
      console.log(`login:: Request to login user failed. data:: `, req.body, err);
      return res.status(Validators.validateCode(err.code,ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success:false,
        message:err.reportError?err.message: UserConstants.MESSAGES.LOGIN_FAILED
      });
    }
  }


    static async signup(req, res) {
    try {
      const user = await AuthManager.createUser(req.body);
      res.json({
        success:true,
        data:user
      });
    } catch (err) {
      
      return res.status(Validators.validateCode(err.code,ErrorCodes.INTERNAL_SERVER_ERROR) || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success:false,
        message: err.reportError ? err.message : UserConstants.MESSAGES.SIGN_UP_FAILED
      });
    }
  }

}

module.exports = AuthController;

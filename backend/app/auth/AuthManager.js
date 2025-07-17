const UserManager = require('../user/UserManager');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthUtil = require('../../utilities/AuthUtil');
const { UserHandler } = require('../../handlers');
const Token = require('../../helpers/Tokens');

const JWT_SECRET = process.env.JWT_SECRET;

class AuthManager {

  static async loginUser(data) {
    console.log(`login:: Request to login user. data:: `, data);
    let user = await UserHandler.findUserByEmail(data.email);
    AuthUtil.validateUserToAuthenticate(user);
    console.log("hello world");
    const passwordMatched = await bcrypt.compare(data.password, user.password);
       
    if (!passwordMatched) {

      console.log(`login:: Password does not match. users:: ${JSON.stringify(user)} data:: `, data);

      throw new Exception(UserConstants.MESSAGES.PASSWORD_DOES_NOT_MATCH, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();

    }
    
    const token = Token.getLoginToken(user);
    return { token, user: { id: user.id, name: user.name, email: user.email, user_type: user.user_type } };

  }



    static async createUser(data) {
       console.log(`signup:: Request to signup user. data:: `, data);
       AuthUtil.validateSignUpRequest(data); 
       let user = await UserHandler.findUserByEmail(data.email);
       AuthUtil.validateUserForSignUp(user);
       data.password = await AuthUtil.createHashedPassword(data.password);
       console.log(data);
       user=await UserHandler.createUser(data);
       console.log(user);
       return user;
      
}

}

module.exports = AuthManager;

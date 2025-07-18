const { UserConstants, ErrorCodes} = require('../constants');
const Exception = require('../helpers/Exception');
const Validators = require('../helpers/Validators');
const bcrypt = require('../helpers/bcrypt');

class AuthUtil{
 static validateSignUpRequest (data) {

    if (!data || (!data.email)) {

      console.log(`validateSignUpRequest:: Invalid data to sign up user. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_DATA_TO_SIGNUP_USER, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

    if (data.email && !Validators.isValidateEmail(data.email)) {

      console.log(`validateSignUpRequest:: Email is not valid. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_EMAIL, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

    if (!Validators.isValidStr(data.password)) {

      console.log(`validateSignUpRequest:: Password is not valid. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_PASSWORD, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

  }


    static validateLoginRequest (data) {

    if (!data || (!data.email)) {

      console.log(`validateLoginRequest:: Invalid data to login user. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_DATA_TO_LOGIN, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();

    }

    if (data.email && !Validators.isValidateEmail(data.email)) {

      console.log(`validateLoginRequest:: Invalid email to login user. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_EMAIL, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();

    }

    

    if (!Validators.isValidStr(data.password)) {

      console.log(`validateLoginRequest:: Invalid password to login user. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_PASSWORD, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();

    }

  }



    static validateUserToAuthenticate (user) {

    if (!user) {

      console.log(`validateUserToAuthenticate:: User does not exist. user:: `, user);

      throw new Exception(UserConstants.MESSAGES.USER_DOES_NOT_EXIST, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

  }


   static validateUserForSignUp (user) {

    if (user) {

      console.log(`validateUserForSignUp:: User already exist against this email. user:: `, user);

      throw new Exception(UserConstants.MESSAGES.USER_ALREADY_EXIST, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

  }


   static async createHashedPassword (password) {

  
    password = await bcrypt.hash(password, 10);

    return password;

  }

  static isManager(user) {
  return user.user_type === 'manager';
}
}
module.exports = AuthUtil;
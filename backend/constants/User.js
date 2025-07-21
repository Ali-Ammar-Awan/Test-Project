const User = Object.freeze({

  MESSAGES: {
    SIGN_UP_FAILED: 'Something went wrong while sign up. Please try again.',
    INVALID_DATA_TO_SIGNUP_USER: 'Invalid data to sign up user',
    INVALID_EMAIL: 'Invalid email provided',
    INVALID_PASSWORD: 'Invalid password provided',
    USER_ALREADY_EXIST: 'User already exist',
    LOGIN_FAILED: 'Something went wrong while login user. Please try again.',
    INVALID_DATA_TO_LOGIN: 'Invalid data to login',
    USER_DOES_NOT_EXIST: 'User does not exist',
    PASSWORD_DOES_NOT_MATCH: 'Invalid email or password',
    FETCHING_USER_FAILED: 'Something went wrong while fetching the user data. Please try again.',
    INVALID_USER_TYPE: 'Invalid user type',
    INVALID_TOKEN: 'Invalid or expired token',
    TOKEN_EXPIRED: 'Token has expired',
  }

});

module.exports = User;

const { UserHandler } = require('../../handlers');
const User = require('../../models/User');
const bcrypt = require('bcrypt');

class UserManager {


  static async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  static async getUsersForAssignment() {
    const user = UserHandler.findUser();
    return user;
  }
}

module.exports = UserManager;

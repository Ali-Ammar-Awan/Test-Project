const User = require('../../models/User');
const bcrypt = require('bcrypt');

class UserManager {


  static async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  static async getUsersForAssignment() {
    return User.findAll({
      where: {
        user_type: ['QA', 'developer']
      },
      attributes: ['id', 'name', 'email', 'user_type'],
      order: [['name', 'ASC']]
    });
  }
}

module.exports = UserManager;

const { Op } = require('sequelize');
const User = require('../models/User');

class UserHandler {
  static findUserByEmail(email) {
    return User.findOne({ where: { email } });
  }

  static createUser({ name, phone_number, email, password, user_type }) {
    return User.create({
      name,
      phone_number,
      email,
      password,
      user_type,
    });
  }


  static findUser() {
    return User.findAll({
      where: {
        user_type: {
          [Op.in]: ['QA', 'developer'],
        },
      },
      attributes: ['id', 'name', 'email', 'user_type'],
      order: [['name', 'ASC']],
    });
  }
}

module.exports = UserHandler;

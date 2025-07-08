const User = require('../../models/User');
const bcrypt = require('bcrypt');

class UserManager {
  static async createUser({ name, email, password, user_type }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return User.create({
      name,
      email,
      password: hashedPassword,
      user_type,
    });
  }

  static async findByEmail(email) {
    return User.findOne({ where: { email } });
  }
}

module.exports = UserManager;

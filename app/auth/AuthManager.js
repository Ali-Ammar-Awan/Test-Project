const UserManager = require('../user/UserManager');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

class AuthManager {
  static async loginUser(email, password) {
    const user = await UserManager.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }
  
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    return { token, user: { id: user.id, name: user.name, email: user.email, user_type: user.user_type } };
  }
}

module.exports = AuthManager;

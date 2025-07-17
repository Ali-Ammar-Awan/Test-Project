const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

class Token {
  static getLoginToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        user_type: user.user_type
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
  }
}

module.exports = Token;

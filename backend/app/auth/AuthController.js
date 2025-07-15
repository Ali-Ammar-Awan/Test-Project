const AuthManager = require('./AuthManager');

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthManager.loginUser(email, password);
      res.status(200).json({ message: 'Login successful', token, user });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

}

module.exports = AuthController;

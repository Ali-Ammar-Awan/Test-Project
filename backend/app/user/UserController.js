const UserManager = require('./UserManager');

class UserController {


  static async getUsers(req, res) {
    try {
      const users = await UserManager.getUsersForAssignment();
      res.status(200).json({ users });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users', details: err.message });
    }
  }
}

module.exports = UserController;

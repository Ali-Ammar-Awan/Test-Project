const UserManager = require('./UserManager');

class UserController {
  static async signup(req, res) {
    try {
      const { name, phone_number, email, password, user_type } = req.body;
      const user = await UserManager.createUser({ name,phone_number, email, password, user_type });
      res.status(201).json({ message: 'User created successfully', user: { id: user.id, name: user.name,phone_number: user.phone_number ,email: user.email, user_type: user.user_type } });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: 'Failed to create user', details: err.message });
    }
  }

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

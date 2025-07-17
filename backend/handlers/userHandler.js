const User = require('../models/User');

class UserHandler {
    static findUserByEmail (email) {
        return User.findOne({where: {email}});
    }



    static createUser({name,phone_number,email,password,user_type}){
    const user = User.create({
      name,
      phone_number,
      email,
      password,
      user_type,
    });
    return user;
  }

}
module.exports = UserHandler;

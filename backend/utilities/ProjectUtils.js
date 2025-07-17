const { UserConstants, ErrorCodes, ProjectConstants} = require('../constants');
const Exception = require('../helpers/Exception');
const Validators = require('../helpers/Validators');
const bcrypt = require('../helpers/bcrypt');

class ProjectUtils{
static validateManagerId (id) {

    if (!id) {

      console.log(`validateCreateProject:: Cannot create Project :: `);

      throw new Exception(ProjectConstants.MESSAGES.DO_NOT_HAVE_ACCESS, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }
}
}

module.exports=ProjectUtils;
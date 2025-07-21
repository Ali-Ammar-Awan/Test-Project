const { ErrorCodes } = require('../constants/ErrorCodes');
const { BUG_STATUSES, FEATURE_STATUSES } = require('../enums/Bug');

class Validators{
  static validateCode(code, defaultCode) {
    return Object.values(ErrorCodes).includes(code) ? code : defaultCode;
  }

   static isValidateEmail (email) {

    const re = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/im;

    return re.test(String(email).toLowerCase());

  }

static isValidStr(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

static isValidStatusForType(type, status) {
  if (type === 'feature') return FEATURE_STATUSES.includes(status);
  if (type === 'bug') return BUG_STATUSES.includes(status);
  return false;
}
  
static isQAorDeveloper(userType) {
  return ['QA', 'developer'].includes(userType);
}
}

module.exports=Validators;
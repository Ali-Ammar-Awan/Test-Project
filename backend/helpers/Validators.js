class Validators{
  static validateCode (code, defaultCode) {

    if (code >= 400 && code < 500) {

      return code;

    }

    return defaultCode;
  
  }

   static isValidateEmail (email) {

    const re = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/im;

    return re.test(String(email).toLowerCase());

  }

static isValidStr(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

  
}

module.exports=Validators;
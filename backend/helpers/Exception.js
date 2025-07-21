class Exception extends Error {
  constructor(message, code = 500, meta = {}) {
    super(message);
    this.code = code;
    this.reportError = meta.reportError !== undefined ? meta.reportError : true;
    this.meta = meta;
  }

  toJson() {
    return {
      code: this.code,
      message: this.message,
      reportError: this.reportError,
      ...this.meta
    };
  }
}

module.exports = Exception;

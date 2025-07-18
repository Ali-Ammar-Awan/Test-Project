const { SUCCESS } = require("./ErrorCodes");

const Bug = Object.freeze({

  MESSAGES: {
     CREATE_SUCCESS:'Bug created successfully',
     ERROR_CREATING:'Failed to create Bug',
     ERROR_LISTING:'Error in listing bugs',
     ERROR_FETCHING:'Error Fetching bug by id',
     ERROR_UPDATING:'Error in updating bug',
     ERROR_DELETING:'Error Deleting Bug',
  }

});

module.exports = Bug;

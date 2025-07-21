const Project = Object.freeze({

  MESSAGES: {
    CREATING_PROJECT_FAILED: 'Something went wrong while creating the project',
    DO_NOT_HAVE_ACCESS: 'You do not have access to perform this action',
    FAILED_FETCH: 'Failed to fetch project(s)',
    PROJECT_NOT_FOUND: 'Project not found',
    NOT_PROJECT_MANAGER: 'Action failed: You are not the manager of this project',
    SUCCESSFUL_UPDATE: 'Project updated successfully',
    UNSUCCESSFUL_UPDATE: 'Failed to update project',
    PROJECT_DELETED: 'Project deleted successfully',
    FAILED_DELETE: 'Failed to delete project',
    USERS_ASSIGNED: 'Users assigned to project successfully',
    FAILED_ASSIGN: 'Failed to assign users to project',
    FAILED_FETCH_ASSIGNEES: 'Failed to fetch project assignees',
    MISSING_PROJECT_NAME: 'Project name is required',
    ASSIGNMENT_INVALID: 'Invalid assignment data provided',
    USER_NOT_FOUND_FOR_ASSIGNMENT: 'One or more users were not found for assignment',
  }

});

module.exports = Project;

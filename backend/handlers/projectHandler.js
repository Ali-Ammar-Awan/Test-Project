const Project = require('../models/Project');
const ProjectAssignment = require('../models/ProjectAssignment');
const User = require('../models/User');
const { getProjectAssignments } = require('../helpers/projectAssignmentHelper');
const { ProjectUtils } = require('../utilities');

class ProjectHandler {
  static createProject({ name, details, image, manager_id  }) {
    ProjectUtils.validateManagerId(manager_id);
    
    return Project.create({ name, details, image, manager_id });
  }
}
module.exports = ProjectHandler;
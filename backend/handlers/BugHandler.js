const Bug = require('../models/Bug');
const ProjectAssignment = require('../models/ProjectAssignment');
const User = require('../models/User');
const Project = require('../models/Project');

class BugHandler{


static async createBug({ title, description, deadline, screenshot, type, status, project_id, developer_id, qa_id }){
const bug = await Bug.create({
      title,
      description,
      deadline,
      screenshot,
      type,
      status,
      project_id,
      developer_id,
      qa_id
    });
    return bug;
    }

    static async getBugs(user, project_id, status, projectIds) {
    const where = {};
    if (status) where.status = status;

    if (user.user_type === 'developer') {
      where[Op.or] = [
        { developer_id: user.id },
        { project_id: project_id || projectIds }
      ];
    } else {
      where.project_id = project_id || projectIds;
    }

    return Bug.findAll({
      where,
      include: [
        { model: User, as: 'developer', attributes: ['id', 'name', 'email', 'user_type'] },
        { model: User, as: 'qa', attributes: ['id', 'name', 'email', 'user_type'] }
      ]
    });
  }

    static async findBugWithDetails(bugId) {
    return Bug.findByPk(bugId, {
      include: [
        { model: Project, attributes: ['id', 'name', 'manager_id'] },
        { model: User, as: 'developer', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'qa', attributes: ['id', 'name', 'email'] }
      ]
    });
  }

    static async findById(id) {
    return Bug.findByPk(id);
  }

  static async findBugById(bugId) {
  const bug = await Bug.findByPk(bugId);
  if (!bug) throw new Error('Bug not found');
  return bug;
}
}

module.exports=BugHandler;
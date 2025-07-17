const Bug = require('../models/Bug');

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
}

module.exports=BugHandler;
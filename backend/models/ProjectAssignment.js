const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./index');
const User = require('./User');
const Project = require('./Project');

class ProjectAssignment extends Model {}

ProjectAssignment.init({
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project,
      key: 'id',
    },
  },
  role: {
    type: DataTypes.ENUM('QA', 'developer'),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'ProjectAssignment',
  tableName: 'project_assignments',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'project_id'],
      name: 'unique_user_project_assignment',
    },
  ],
});


ProjectAssignment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.belongsToMany(Project, { through: ProjectAssignment, foreignKey: 'user_id', as: 'assignedProjects' });
Project.belongsToMany(User, { through: ProjectAssignment, foreignKey: 'project_id', as: 'assignedUsers' });

module.exports = ProjectAssignment; 
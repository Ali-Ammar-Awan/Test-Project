const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./index');
const User = require('./User');
const Project = require('./Project');
const { BUG_TYPES, FEATURE_STATUSES, BUG_STATUSES } = require('../enums/Bug');

class Bug extends Model {}

Bug.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'unique_title_per_project',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  screenshot: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /\.(png|gif)$/i,
    },
  },
  type: {
    type: DataTypes.ENUM(...BUG_TYPES),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project,
      key: 'id',
    },
    unique: 'unique_title_per_project',
  },
  developer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  qa_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Bug',
  tableName: 'bugs',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['title', 'project_id'],
      name: 'unique_title_per_project',
    },
  ],
});


Bug.belongsTo(Project, { foreignKey: 'project_id' });
Project.hasMany(Bug, { foreignKey: 'project_id' });

Bug.belongsTo(User, { as: 'developer', foreignKey: 'developer_id' });
User.hasMany(Bug, { as: 'assignedBugs', foreignKey: 'developer_id' });

Bug.belongsTo(User, { as: 'qa', foreignKey: 'qa_id' });
User.hasMany(Bug, { as: 'createdBugs', foreignKey: 'qa_id' });

module.exports = Bug; 
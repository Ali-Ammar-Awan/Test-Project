const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./index');
const User = require('./User');

class Project extends Model {}

Project.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  manager_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  details: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Project',
  tableName: 'projects',
  timestamps: true,
});


Project.belongsTo(User, { as: 'manager', foreignKey: 'manager_id' });
User.hasMany(Project, { as: 'managedProjects', foreignKey: 'manager_id' });

module.exports = Project; 
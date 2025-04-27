const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Permission extends Model {
    static associate(models) {
      Permission.belongsToMany(models.Role, {
        through: models.RolePermission,
        foreignKey: 'permId',
        as: 'roles'
      });
      
      Permission.belongsTo(models.Permission, {
        foreignKey: 'parent_id',
        as: 'parent'
      });
      
      Permission.hasMany(models.Permission, {
        foreignKey: 'parent_id',
        as: 'children'
      });
    }
  }

  Permission.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    perm_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    perm_desc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    parent_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'database_permissions',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Permission',
    tableName: 'database_permissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Permission;
};
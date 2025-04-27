const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class RolePermission extends Model {
    static associate(models) {
      // No additional associations needed as this is a junction table
    }
  }

  RolePermission.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'database_roles',
        key: 'id'
      }
    },
    perm_id: {
      type: DataTypes.UUID,
      allowNull: false,
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
    modelName: 'RolePermission',
    tableName: 'database_roles_permissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return RolePermission;
};
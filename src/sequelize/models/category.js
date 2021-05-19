const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            models.Category.hasMany(models.Subcategory, {
                foreignKey: {
                    name: 'category_id',
                    allowNull: false,
                },
                sourceKey: 'category_id',
            });
        }
    }

    Category.init({
        category_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        category_name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'categories',
        modelName: 'Category',
        timestamps: false,
    });

    return Category;
};
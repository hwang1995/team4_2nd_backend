const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Subcategory extends Model {
        static associate(models) {
            models.Subcategory.belongsTo(models.Category, {
                foreignKey: {
                    name: 'category_id',
                    allowNull: false,
                },
                targetKey: 'category_id',
            });

            models.Subcategory.hasMany(models.Product, {
                foreignKey: {
                    name: 'subcategory_id',
                    allowNull: false,
                },
                sourceKey: 'subcategory_id',
            });
        }
    }

    Subcategory.init({
        subcategory_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        subcategory_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'subcategories',
        modelName: 'Subcategory',
        timestamps: false,
    });

    return Subcategory;
};
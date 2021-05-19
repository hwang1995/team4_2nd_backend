const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Color extends Model {
        static associate(models) {
            models.Color.belongsTo(models.Product, {
                foreignKey: {
                    name: 'product_id',
                    allowNull: false,
                },
                targetKey: 'product_id',
            });
        }
    }

    Color.init({
        color_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        color_name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'colors',
        modelName: 'Color',
        timestamps: false,
    });

    return Color;
};
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Size extends Model {
        static associate(models) {
            models.Size.belongsTo(models.Product, {
                foreignKey: {
                    name: 'product_id',
                    allowNull: false,
                },
                targetKey: 'product_id',
            });
        }
    }

    Size.init({
        size_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        size_name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'sizes',
        modelName: 'Size',
        timestamps: false,
    });
    return Size;
};
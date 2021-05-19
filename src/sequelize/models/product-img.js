const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductImg extends Model {
        static associate(models) {
            models.ProductImg.belongsTo(models.Product, {
                foreignKey: {
                    name: 'product_id',
                    allowNull: false,
                },
                targetKey: 'product_id',
            });
        }
    }

    ProductImg.init({
        product_img_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        product_img_type: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        product_img_category: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        product_img_name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'product_imgs',
        modelName: 'ProductImg',
        timestamps: false,
    });

    return ProductImg;
};
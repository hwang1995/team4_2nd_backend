const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            models.Product.hasMany(models.Cart, {
                foreignKey: {
                    name: 'product_id',
                    allowNull: false,
                },
                sourceKey: 'product_id',
            });

            models.Product.belongsTo(models.Subcategory, {
                foreignKey: {
                    name: 'subcategory_id',
                    allowNull: false,
                },
                targetKey: 'subcategory_id',
            });

            models.Product.hasMany(models.Color, {
                foreignKey: {
                    name: 'product_id',
                    allowNull: false,
                },
                sourceKey: 'product_id',
            });

            models.Product.hasMany(models.ProductImg, {
                foreignKey: {
                    name: 'product_id',
                    allowNull: false,
                },
                sourceKey: 'product_id',
            });

            models.Product.hasMany(models.Size, {
                foreignKey: {
                    name: 'product_id',
                    allowNull: false,
                },
                sourceKey: 'product_id',
            });

            models.Product.hasMany(models.OrderList, {
                foreignKey: {
                    name: 'product_id',
                    allowNull: false,
                },
                sourceKey: 'product_id',
            });
        }
    }

    Product.init({
        product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        product_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        product_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_image: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        product_content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        product_subcontent: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        product_deleted: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'products',
        modelName: 'Product',
        timestamps: false,
    });

    return Product;
};
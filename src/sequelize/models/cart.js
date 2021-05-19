const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            models.Cart.belongsTo(models.Member, {
                foreignKey: {
                    name: 'member_id',
                    allowNull: false,
                },
                targetKey: 'member_id',
            });

            models.Cart.belongsTo(models.Product, {
                foreignKey: {
                    name: 'product_id',
                    allowNull: false,
                },
                targetKey: 'product_id',
            });
        }
    }

    Cart.init({
        cart_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        cart_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_color: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        product_size: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'carts',
        modelName: 'Cart',
        timestamps: false,
    });
    
    return Cart;
};
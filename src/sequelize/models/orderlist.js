const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderList extends Model {
        static assoicate(models) {
            models.OrderList.belongsTo(models.Order, {
                foreignKey: {
                    name: 'order_id',
                    allowNull: false,
                },
                targetKey: 'order_id',
            });

            models.OrderList.belongsTo(models.Product, {
                foreignKey: {
                    name: 'product_id',
                    allowNull: false,
                },
                targetKey: 'product_id',
            });
        }
    }

    OrderList.init({
        orderlist_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        orderlist_quantity: {
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
        tableName: 'orderlists',
        modelName: 'OrderList',
        timestamps: false,
    });
    return OrderList;
};
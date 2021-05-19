const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            models.Order.belongsTo(models.Member, {
                foreignKey: {
                    name: 'member_id',
                    allowNull: false,
                },
                targetKey: 'member_id',
            });

            models.Order.hasMany(models.OrderList, {
                foreignKey: {
                    name: 'order_id',
                    allowNull: false,
                },
                sourceKey: 'order_id',
            });
        }
    }

    Order.init({
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        order_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        order_bank: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        order_delivery_charge: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        order_payment_status: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        order_delivery_status: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        recipient_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        recipient_address: {
            type: DataTypes.STRING(600),
            allowNull: false,
        },
        recipient_tel: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'orders',
        modelName: 'Order',
        timestamps: false,
        initialAutoIncrement: 10000165,
    });
    
    return Order;
};
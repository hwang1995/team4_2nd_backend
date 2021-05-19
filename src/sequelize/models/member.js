const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Member extends Model {
        static associate(models) {
            models.Member.hasMany(models.Qna, {
                foreignKey: {
                    name: 'member_id',
                    allowNull: false,
                },
                sourceKey: 'member_id',
            });

            models.Member.hasMany(models.Order, {
                foreignKey: {
                    name: 'member_id',
                    allowNull: false,
                },
                sourceKey: 'member_id',
            });

            models.Member.hasMany(models.Cart, {
                foreignKey: {
                    name: 'member_id',
                    allowNull: false,
                },
                sourceKey: 'member_id',
            });
        }
    }

    Member.init({
        member_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        member_email: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        member_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        member_pw: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        member_tel: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        member_address: {
            type: DataTypes.STRING(600),
            allowNull: false,
        },
        member_authority: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        member_enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'members',
        modelName: 'Member',
        timestamps: false,
    });

    return Member;
};
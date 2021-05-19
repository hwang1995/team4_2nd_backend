const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Qna extends Model {
        static associate(models) {
            models.Qna.belongsTo(models.Member, {
                foreignKey: {
                    name: 'member_id',
                    allowNull: false,
                },
                targetKey: 'member_id',
            });
        }
    }

    Qna.init({
        qna_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        qna_category: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        qna_title: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        qna_content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        qna_answer: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Qna',
        tableName: 'qnas',
        timestamps: false,
    });

    return Qna;
};
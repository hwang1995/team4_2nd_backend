const moment = require('moment');
const db = require('../sequelize/models');
const logger = require('../utils/logger');
const loginMessageWrapper = require('../utils/login-message-wrapper');

const { Op } = db.Sequelize;

const getDashboardData = async () => {
    try {
        // totalMembers
        const totalMembers = await db.Member.count();

        // totalDeliveryFinished
        const totalDeliveryFinished = await db.Order.count({
            where: {
                order_delivery_status: 'DELIVERY_COMPLETED',
            },
        });
        // totalQnaWaiting
        const totalQnaWaiting = await db.Qna.count({
            where: {
                qna_answer: '답변중',
            },
        });
        // totalDeliveryWaiting
        const totalDeliveryWaiting = await db.Order.count({
            where: {
                order_delivery_status: 'DELIVERY_PENDING',
            },
        });
        // totalProducts
        const totalProducts = await db.Product.count({
            where: {
                product_deleted: 'NO',
            },
        });

        // totalQnaFinished
        const totalQnaFinished = await db.Qna.count({
            where: {
                qna_answer: {
                    [Op.not]: '답변중',
                },
            },
        });

        // chart (chartData)

        const orderInfo = await db.Order.findAll();
        const orderDate = {};

        // 날짜 Object를 만든다.
        for await (const { dataValues } of orderInfo) {
            const date = moment(dataValues.order_date).format('YYYY-MM-DD');
            orderDate[date] = [];
        }
        
        for await (const { dataValues } of orderInfo) {
            let totalPrice = 0;
            const date = moment(dataValues.order_date).format('YYYY-MM-DD');

            const { order_id } = dataValues;

            // 주문 리스트를 가져오기
            const orderListInfo = await db.OrderList.findAll({
                where: {
                    order_id,
                },
            });

            // 주문마다 총 가격의 합계를 구함
            for await (const orderList of orderListInfo) {
                const { orderlist_quantity } = orderList.dataValues;
                const { product_price } = await db.Product.findOne({
                    where: {
                        product_id: orderList.product_id,
                    },
                });
                totalPrice += product_price * orderlist_quantity;
            }

            // 해당 날짜에 총 가격을 추가한다.
            orderDate[date].push(totalPrice);
        }

        const chart = [];
        for (const [key, value] of Object.entries(orderDate)) {
            const reducer = (preValue, currentValue, currentIndex, arr) => preValue + currentValue;

            const totalPrice = value.reduce(reducer);
            chart.push({
                order_date: key,
                sum_price: totalPrice,
            });
        }

        return {
            totalMembers,
            totalDeliveryFinished,
            totalQnaWaiting,
            totalDeliveryWaiting,
            totalProducts,
            totalQnaFinished,
            chart,
        };
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

module.exports = {
    getDashboardData,
};
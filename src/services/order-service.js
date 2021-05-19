const db = require('../sequelize/models');
const logger = require('../utils/logger');

const { Op } = db.Sequelize;

const totalRows = async (orderId, delivery) => {
    const isNotOrderIdAndDelivery = Number.isNaN(orderId) && (delivery === undefined);
    const isOnlyOrderId = (!Number.isNaN(orderId)) && (delivery === undefined);
    const isOnlyDeliveryStatus = (Number.isNaN(orderId)) && !(delivery === undefined);

    let result = '';
    if(isNotOrderIdAndDelivery) {
        result = await db.Order.count();
    } else if (isOnlyOrderId) {
        result = await db.Order.count({
            where: {
                order_id: orderId,
            },
        });
    } else if (isOnlyDeliveryStatus) {
        result = await db.Order.count({
            where: {
                order_delivery_status: delivery,
            },
        });
    }

    return result;
};

/**
 * 상품의 목록을 가지고 오기 위한 서비스
 * @param {Pager} pager 
 * @param {Number || string || undefined} options 
 */
const getOrderList = async (pager, options) => {
    try {
        let where = '';
        if(typeof options === 'number') {
            where = {
                order_id: options,
            };
        } else if(typeof options === 'string') {
            where = {
                order_delivery_status: options,
            };
        } else if(typeof options === 'undefined') {
            where = {};
        }

        return await db.Order.findAll({
            limit: pager.rowsPerPage,
            offset: pager.startRowIndex,
            order: [
                ['order_id', 'DESC'],
            ],
            where,
        });
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getOrderInfo = async (orderId) => {
    try {
        let totalPrice = 0;
        const where = {
            order_id: orderId,
        };
        // 우선 주문 정보를 가져온다.
        const orderInfo = await db.Order.findOne({
            where,
        });

        // 주문리스트 정보를 가져온다.
        const orderListInfo = await db.OrderList.findAll({
            where,
        });

        // 총 가격을 구하기 위해 looping을 한다.
        for await (const { dataValues } of orderListInfo) {
            // 얻어온 주문 리스트에서 수량과 상품 번호를 구조 분해 할당 (Destructive Object)
            const { orderlist_quantity, product_id } = dataValues;

            const productInfo = await db.Product.findOne({
                where: {
                    product_id,
                },
            });

            const { product_name, product_price } = productInfo.dataValues;

            dataValues.product_price = product_price;
            dataValues.product_name = product_name;
            dataValues.product_quantity = dataValues.orderlist_quantity;

            totalPrice += orderlist_quantity * product_price;
        }

        // 회원 정보를 가져온다.
        const memberInfo = await db.Member.findOne({
            where: {
                member_id: orderInfo.dataValues.member_id,
            },
            attributes: {
                exclude: ['member_pw', 'member_authority', 'member_enabled'],
            },
        });

        return {
            order: orderInfo,
            orderInfoList: orderListInfo,
            member: memberInfo,
            totalPrice,
        };
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const modifyOrder = async (orderInfo) => {
    try {
        const result = await db.Order.update(orderInfo, {
            where: {
                order_id: orderInfo.order_id,
            },
        });
        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

const getModifiedInfo = async ({ order_id }) => {
    try {
        const result = await db.Order.findOne({
            where: {
                order_id,
            },
        });
        return result;
    } catch (error) {
        logger.error(error);
        throw error;
    }
};

module.exports = {
    totalRows,
    getOrderList,
    getOrderInfo,
    modifyOrder,
    getModifiedInfo,
};
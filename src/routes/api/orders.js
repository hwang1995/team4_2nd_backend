const router = require('express').Router();
const logger = require('../../utils/logger');
const paging = require('../../utils/paging');
const orderService = require('../../services/order-service');

// getOrdersList
router.get('/', async (req, res, next) => {
    try {
        let pageNo = parseInt(req.query.pageNo, 10);
        const orderId = parseInt(req.query.orderId, 10);
        const { delivery } = req.query;

        const isNotOrderIdAndDelivery = Number.isNaN(orderId) && (delivery === undefined);
        const isOnlyOrderId = (!Number.isNaN(orderId)) && (delivery === undefined);
        const isOnlyDeliveryStatus = (Number.isNaN(orderId)) && !(delivery === undefined);

        pageNo = (Number.isNaN(pageNo)) ? 1 : pageNo;

        const totalRows = await orderService.totalRows(orderId, delivery);
        const pager = paging.init(10, 5, pageNo, totalRows);
        let orders = '';

        if(isNotOrderIdAndDelivery) {
            orders = await orderService.getOrderList(pager);
        } else if(isOnlyOrderId) {
            orders = await orderService.getOrderList(pager, orderId);
        } else if(isOnlyDeliveryStatus) {
            orders = await orderService.getOrderList(pager, delivery);
        }
        res.json({
            pager, orders,
        });
    } catch (error) {
        next(error);
    }
});

// modifyOrder
router.put('/', async (req, res, next) => {
    const info = req.body;
    try {
        const result = await orderService.modifyOrder(info);
        const orderInfo = await orderService.getModifiedInfo(info);
        res.json({
            order: orderInfo,
        });
    } catch (error) {
        next(error);
    }
});

// getOrderInfo
router.get('/:order_id', async (req, res, next) => {
    try {
        const orderId = parseInt(req.params.order_id, 10);
        const result = await orderService.getOrderInfo(orderId);

        res.json(result);
    } catch (error) {
        next(error);
    }
});


module.exports = router;
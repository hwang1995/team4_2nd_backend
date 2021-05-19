const router = require('express').Router();
const logger = require('../../utils/logger');
const dashboardService = require('../../services/dashboard-service');
// 서비스 모듈

// getDashboardData
router.get('/', async (req, res, next) => {
    try {
        const result = await dashboardService.getDashboardData();
        res.json(result);
    } catch (error) {
        next(error);
    }
});
module.exports = router;
const router = require('express').Router();
const logger = require('../../utils/logger');
const paging = require('../../utils/paging');
const qnaService = require('../../services/qna-service');

// getQnasList
router.get('/', async (req, res, next) => {
    let pageNo = parseInt(req.query.pageNo, 10);

    pageNo = (Number.isNaN(pageNo)) ? 1 : pageNo;
    logger.info(req.query.qna_category);
    const totalRows = await qnaService.totalRows(req.query);
    const pager = paging.init(10, 5, pageNo, totalRows);
    const result = await qnaService.getQnasList(pager, req.query);
    res.json({
        pager, qnas: result,
    });
});

// modifyQna
router.put('/', async (req, res, next) => {
    const qnaInfo = req.body;
    try {
        const result = await qnaService.modifyQna(qnaInfo);     
        res.json('result');
    } catch (error) {
        next(error);
    }
});

// getQna
router.get('/:qna_id', async (req, res, next) => {
    const qnaId = parseInt(req.params.qna_id, 10);

    try {
        const result = await qnaService.getQnaDetails(qnaId);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// deleteQna
router.delete('/:qna_id', async (req, res, next) => {
    const qnaId = req.params.qna_id;

    try {
        const result = await qnaService.deleteQna(qnaId);
        res.json(result);
    } catch (error) {
        next(error);
    }
});



module.exports = router;
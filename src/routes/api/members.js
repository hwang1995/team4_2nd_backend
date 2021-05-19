const router = require('express').Router();
const logger = require('../../utils/logger');
const paging = require('../../utils/paging');
const memberService = require('../../services/member-service');

// 임시로 데이터 보내기 위한 객체


// getMembersList
router.get('/', async (req, res, next) => {
    try {
        const { email, name } = req.query;
        let pageNo = parseInt(req.query.pageNo, 10);
        pageNo = (Number.isNaN(pageNo)) ? 1 : pageNo;

        const totalRows = await memberService.totalRows(email, name);
        const pager = paging.init(5, 5, pageNo, totalRows);

        const member = await memberService.getMembersList(pager, email, name);
        
        logger.info(totalRows);
        res.json({
            pager, list: member,
        });
    } catch (error) {
        next(error);
    }
});

// modifyMembersInfo
router.put('/', async (req, res, next) => {
    const memberInfo = req.body;
    try {
        const result = await memberService.modifyMemberInfo(memberInfo);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// deleteMember
router.delete('/:member_id', async (req, res, next) => {
    const memberId = req.params.member_id;

    try {
        const result = await memberService.deleteMember(memberId);
        res.json(result);
    } catch (error) {
        next(error);
    }
});



module.exports = router;
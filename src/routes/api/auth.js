const router = require('express').Router();
const logger = require('../../utils/logger');
const memberService = require('../../services/member-service');
const errorMessageWrapper = require('../../utils/error-message-wrapper');
const jwtAuth = require('../../utils/jwt-auth');

// login
router.post('/login', async (req, res, next) => {
    try {
        const userInfo = req.body;
        logger.info(userInfo);
        if(!userInfo.email) {
            res.status(403);
            res.json(errorMessageWrapper(
                'Invalid Email Type',
                '이메일 형식에 맞게 입력해주세요.',
            ));
            return;
        }

        const result = await memberService.login(userInfo);
        if(result.id !== 'success') {
            res.status(403);
            res.json(result);
        } else {
            const authToken = jwtAuth.createToken(userInfo.email);
            res.json({
                email: userInfo.email,
                authToken,
            });
        }
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

router.post('/register', async (req, res, next) => {
    const memberInfo = req.body;

    try {
        const result = await memberService.registMember(memberInfo);
        res.json(result);
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

router.post('/existed-email', async (req, res, next) => {
    const memberInfo = req.body;

    try {
        const result = await memberService.isExistedEmail(memberInfo);
        if(result) {
            res.json(result);
        }
        res.json(undefined);
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

module.exports = router;
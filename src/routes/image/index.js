const router = require('express').Router();
const path = require('path');
const homedir = require('os').homedir();
const errorMessageWrapper = require('../../utils/error-message-wrapper');

router.get('/', (req, res, next) => {
    const FILE_NAME = req.query.path;
    try {
        if(!FILE_NAME) {
            res.status(403);
            res.json(errorMessageWrapper('NO FILE NAME', '상세한 파일의 경로를 입력해주세요.'));
        } else {
            const FILE_PATH = path.join(homedir, 'images', FILE_NAME);
            res.download(FILE_PATH);
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
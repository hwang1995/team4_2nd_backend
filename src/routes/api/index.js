const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/dashboard', require('./dashboard'));
router.use('/mail', require('./mail'));
router.use('/members', require('./members'));
router.use('/orders', require('./orders'));
router.use('/products', require('./products'));
router.use('/qna', require('./qnas'));


module.exports = router;
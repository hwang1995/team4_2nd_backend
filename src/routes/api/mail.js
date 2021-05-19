const router = require('express').Router();
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const logger = require('../../utils/logger');

const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: 'byeongju3121@gmail.com',
        pass: 'qudwn1541!',
    },
}));

// 라우터
router.post('/', async (req, res, next) => {
    const { address, title, message } = req.body;
    const mailOptions = {
        from: 'byeongju3121@gmail.com',
        to: address,
        subject: title,
        text: message,
    };

    transporter
        .sendMail(mailOptions)
        .then((error, info) => {
        });
    res.json(mailOptions);
});

module.exports = router;
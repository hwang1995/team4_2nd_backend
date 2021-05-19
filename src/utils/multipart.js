const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');
const homedir = require('os').homedir();

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, `${homedir}/images/main`);
        },
        filename(req, file, done) {
            done(null, uuid() + path.extname(file.originalname));
        },
    }),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

module.exports = upload;
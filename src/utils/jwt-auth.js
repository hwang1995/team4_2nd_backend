const jwt = require('jsonwebtoken');

const messageWrapper = require('./error-message-wrapper');
const logger = require('./logger');

const createToken = (email) => {
    const authToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '12h' });
    return authToken;
};

const setToken = (req, res, next) => {
    let authToken = null;
    const isThroughImage = req.url.includes('image');
    if(req.signedCookies.authToken) {
        authToken = req.signedCookies.authToken;
    } else if (req.headers.authtoken) {
        authToken = req.headers.authtoken;
    } else if (req.query.authToken) {
        authToken = req.query.authToken;
    }

    if(authToken) {
        const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
        const expires = decodedToken.exp;
        const now = Math.floor(Date.now() / 1000);
        const isValid = ((expires - now) > 0) && decodedToken.email;

        if(isValid) {
            req.email = decodedToken.email;
        }
        next();
    } else {
        if(isThroughImage) {
            next();
            return;
        }
        const message = messageWrapper('No AuthToken', 'Please Login First');
        res.json(message);
    }
};

const checkToken = (req, res, next) => {
    if(req.email) {
        next();
    } else {
        const message = messageWrapper('No AuthToken', 'Please Login First');

        res.json(message);
    }
};

module.exports = {
    createToken,
    setToken,
    checkToken,
};

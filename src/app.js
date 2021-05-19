const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./sequelize/models/index');
const logger = require('./utils/logger');

// Router Declare
const apiRouter = require('./routes/api/index');
const imageRouter = require('./routes/image/index');
const { setToken } = require('./utils/jwt-auth');


dotenv.config();

const app = express();
app.set('port', process.env.PORT);


// app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'front')));
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json({
    limit: '10mb',
}));
app.use(cookieParser(process.env.COOKIE_SECRET));

sequelize
    .sync()
    .then(() => {
        logger.info('DB 연결 성공');
    })
    .catch((err) => {
        logger.error(err.message);
    });



app.use((req, res, next) => {
    const isAuthProcess = req.url.includes('/api/auth');
    if(isAuthProcess) {
        next();
    } else {
        setToken(req, res, next);
    }
});
// Router
app.use('/api', apiRouter);
app.use('/image', imageRouter);

// Error Handling
app.use((req, res, next) => {
    const error = new Error('Wrong Request');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    const error = {};
    error.method = req.method;
    error.accessUrl = req.url;
    error.errorMessage = err.message;
    error.status = err.status || 500;
    res.status(error.status);
    res.send(error);
});

app.listen(app.get('port'), () => {
    logger.info(`Listening to port ${app.get('port')}`);
});
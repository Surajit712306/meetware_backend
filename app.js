const express = require('express');
const app = express();
const cors = require('cors');
const {v4 : uuidv4} = require('uuid');
const {errorHandler, notFound} = require('./middlewares/global');

app.disable('x-powered-by');
app.set('trust proxy', false);
app.use(cors({
    origin: true,
    credentials: true
}));

//parse the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const router = express.Router();
app.use('/', router);

router.get('/', (req, res) => {
    return res.json({
        type: "SUCCESS",
        payload: {
            wish: "Hello, World!"
        }
    });
});

router.get('/room', (req, res) => {
    return res.json({
        type: "SUCCESS",
        payload: uuidv4()
    });
});

app.use(errorHandler);
router.all('*', notFound);

module.exports = app;
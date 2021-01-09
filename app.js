const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://root:nLjBdZN9F64dLQ7@cluster0.yqc57.mongodb.net/node-rest-api-test?retryWrites=true&w=majority',{
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,resp,next) => {
    resp.header('Access-Control-Allow-Origin','*');
    resp.header(
        'Access-Control-Allow-Headers',
        'Origin,X-Requested-With,Content-Type,Accept,Authorization'
    );
    if (req.method === 'OPTIONS') {
        resp.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        resp.status(200).json({});
    }
    next();
});

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

app.use((req,res,next) => {
    const error = new Error('NOT FOUND');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;
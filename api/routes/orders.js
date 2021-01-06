const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');

router.get('/', (req,resp,next) => {
    Order.find()
        .select('quantity _id product')
        .populate('product','name price')
        .exec()
        .then(docs => {
        resp.status(200).json({
            count : docs.length,
            orders : docs.map(doc => {
                return {
                    _id : doc._id,
                    product : doc.product,
                    quantity : doc.quantity,
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
        });
    }).catch(error => {
        resp.status(500).json({
            error : error
        });
    });
});

router.post('/', (req,resp,next) => {
    const order = new Order({
        _id : new mongoose.Types.ObjectId,
        product : req.body.productId,
        quantity : req.body.quantity
    });
    order.save()
        .then(result => {
            resp.status(201).json({
                message : 'Orders created succesfully',
                createdOrder : {
                    _id : result._id,
                    product : result.product,
                    quantity : result.quantity
                },
                request : {
                    type : 'GET',
                    url : 'http://localhost:3000/orders/' + result._id
                }
            });
        }).catch(error => {
            resp.status(201).json({
                message : 'Orders created succesfully',
                error : error
            });
        });
});

router.get('/:orderId', (req,resp,next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .populate('product','name price')
        .exec()
        .then(order => {
            resp.status(200).json({
                message : 'Order details',
                order : order
            });
        }).catch(error => {
            resp.status(500).json({
                error : error
            });
        });
});

router.delete('/:orderId', (req,resp,next) => {
    const id = req.params.orderId;

    Order.deleteOne({_id:id})
        .exec()
        .then(result => {
            resp.status(200).json({
                message : 'Order Deleted',
                orderId : id
            });
        })
        .catch(error => {
            resp.status(500).json({
                message : 'Order Deleted failed',
                orderId : id
            });
        });
});

module.exports = router;


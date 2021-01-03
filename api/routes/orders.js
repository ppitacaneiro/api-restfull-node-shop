const express = require('express');
const router = express.Router();

router.get('/', (req,resp,next) => {
    resp.status(200).json({
        message : 'Orders retrieved succesfully'
    });
});

router.post('/', (req,resp,next) => {
    const order = {
        productId : req.body.productId,
        quantity : req.body.quantity
    }
    resp.status(201).json({
        message : 'Orders created succesfully',
        order : order
    });
});

router.get('/:orderId', (req,resp,next) => {
    const id = req.params.orderId;
    resp.status(200).json({
        message : 'Order details',
        id : id
    });
});

router.delete('/:orderId', (req,resp,next) => {
    const id = req.params.orderId;
    resp.status(200).json({
        message : 'Delete Order',
        id : id
    });
});

module.exports = router;


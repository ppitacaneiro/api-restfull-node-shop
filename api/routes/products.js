const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const { response } = require('../../app');

router.get('/', (req,resp,next) => {
    Product.find()
        .select('_id name price')
        .exec()
        .then(docs => {
            const response = {
                count : docs.length,
                products : docs.map(doc => {
                    return {
                        name : doc.name,
                        price : doc.price,
                        _id : doc._id,
                        request : {
                            type : 'GET',
                            url : 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            resp.status(200).json(response);
        }).catch(error => {
            resp.status(500).json(error);
        });
});

router.post('/', (req,resp,next) => {
    const product = new Product ({
        _id : new mongoose.Types.ObjectId,
        name : req.body.name,
        price : req.body.price
    });
    product.save()
           .then(result => {
                resp.status(201).json({
                    message : 'Product save',
                    createdProduct : {
                        _id : product._id,
                        name : product.name,
                        price : product.price,
                        request : {
                            type : 'GET',
                            url : 'http://localhost:3000/products/' + product._id
                        }
                    }
                });
           }).catch(error => {
                resp.status(500).json({
                    message : 'Error saving product',
                    error : error
                });
           });
});

router.get('/:productId', (req,resp,next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('_id name price')
        .exec()
        .then(doc => {
        resp.status(200).json({
            product : doc
        });
    }).catch(error => {
        resp.status(500).json({
            message : 'Product not found',
            error : error
        });
    });
});

router.patch('/:productId', (req,resp,next) => {
    const id = req.params.productId;
    const updatedOps = {};
    for (const [key,value] of Object.entries(req.body)) {
        updatedOps[key] = value;
    }
    Product.updateOne({_id:id},{$set:updatedOps}).exec()
        .then(result => {
            resp.status(200).json({
                message : result
            });
        })
        .catch(error => {
            resp.status(500).json({
                error : error
            });
        });
});

router.delete('/:productId', (req,resp,next) => {
    const id = req.params.productId;
    Product.deleteOne({_id:id})
        .exec()
        .then(result => {
            resp.status(200).json(result);
        }).catch(err => {
            resp.status(500).json({
                error : err
            });
        });
});

module.exports = router;


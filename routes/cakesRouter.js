const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Cakes = require('../models/cakes');
const cakeRouter = express.Router();
cakeRouter.use(bodyParser.json());

cakeRouter.route('/')
    .get((req, res, next) => {
        Cakes.find({})
            .then((cakes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(cakes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post((req, res, next) => {
        Cakes.create(req.body)
            .then((cakes) => {
                console.log('cakes Create ', cakes);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(cakes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /cakes');
    })

    .delete((req, res, next) => {
        Cakes.deleteMany({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

cakeRouter.route('/:cakeId')
    .get((req, res, next) => {
        Cakes.findById(req.params.cakeId)
            .then((cake) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(cake);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /cakes/' + req.params.cakeId);
    })

    .put((req, res, next) => {
        Cakes.findByIdAndUpdate(req.params.cakeId, {
            $set: req.body
        }, { new: true })
            .then((cake) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(cake);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete((req, res, next) => {
        Cakes.findByIdAndDelete(req.params.cakeId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = cakeRouter;
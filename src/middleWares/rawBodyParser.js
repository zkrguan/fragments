const { Fragment } = require('../models/fragment');
const express = require('express');
const contentType = require('content-type');
const logger = require('../logger');

// Define the rawBody middleware
const rawBodyMiddleware = express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
        // See if we can parse this content type. If we can, `req.body` will be
        // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
        // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
        const { type } = contentType.parse(req);
        return Fragment.isSupportedType(type);
    },
});

// Export the middleware
module.exports = rawBodyMiddleware;

// Optionally, if you want to use it as part of a custom middleware function
exports.rawBody = (req, res, next) => {
    logger.debug(`This is inside the mid ware`);
    rawBodyMiddleware(req, res, next);
};

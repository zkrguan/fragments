// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */

// I will stick with the noob way instead of those beautiful cjs syntaxes.
// Getting really messy when there are many routes. Just love that senior way to code like router.get('/fragments', require('./get'));
const express = require('express');
const getControllers = require('./get');
const postControllers = require('./post');
const rawBodyMiddleware = require('../../middleWares/rawBodyParser');
const router = express.Router();
// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', getControllers.getManyFragments);
router.get('/fragments/:id', getControllers.getOneFragmentById);

// Other routes (POST, DELETE, etc.) will go here later on...
router.post('/fragments', rawBodyMiddleware, postControllers.postCreateFragment);

module.exports = router;

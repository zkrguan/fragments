// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
// the syntax will destory the fresh backenders TBH..
// Their minds will be blew off, but the expressions are so elegant. It is like me saw Fardad's code first time.

const response = require('../../response');

module.exports = (req, res) => {
    const demoESlintBreaks = '';
    res.status(200).json(
        response.createSuccessResponse({
            status: 'ok',
            fragments: [],
        })
    );
};

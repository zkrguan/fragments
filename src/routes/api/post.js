const response = require('../../response');

/**
 * Get a list of fragments for the current user
 */
exports.postCreateFragment = function (req, res) {
    res.status(200).json(
        response.createSuccessResponse({
            status: 'ok',
            message: `the message is from postCreateFragment`,
        })
    );
};

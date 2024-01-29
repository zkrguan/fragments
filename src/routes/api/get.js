const response = require('../../response');

/**
 * Get a list of fragments for the current user
 */
exports.getManyFragments = function (req, res) {
    res.status(200).json(
        response.createSuccessResponse({
            status: 'ok',
            fragments: [],
        })
    );
};

/**
 * Get one individual fragment by the fragment ID
 */
exports.getOneFragmentById = function (req, res) {
    res.status(200).json(
        response.createSuccessResponse({
            status: 'ok',
            fragments: { id: req.params.id },
        })
    );
};

const { Fragment } = require('../../models/fragment');
const response = require('../../response');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
exports.getManyFragments = async function (req, res) {
    const expandValue = req.query.expand === '1';
    logger.info(`expanding?` + expandValue);
    try {
        res.status(200).json(
            response.createSuccessResponse({
                status: 'ok',
                fragments: await Fragment.byUser(req.user, expandValue),
            })
        );
    } catch (err) {
        logger.error(err);
        res.status(501).json(
            response.createErrorResponse({
                status: '501',
                message: 'internal error',
            })
        );
    }
};

/**
 * Get one individual fragment by the fragment ID
 */
exports.getOneFragmentById = async function (req, res) {
    const id = req.params['id'];
    try {
        const result = await Fragment.byId(req.user, id);
        const data = await result.getData();
        res.status(200).json(
            response.createSuccessResponse({
                status: 'ok',
                fragments: data.toString(),
            })
        );
    } catch (error) {
        if (error == 'The result is undefined') {
            res.status(404).json(
                response.createErrorResponse({
                    status: 'not found',
                    message: 'Server could not find related fragment related to this ID',
                })
            );
        }
    }
};

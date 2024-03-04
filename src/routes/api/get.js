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
        // This should never ever run. If so, that means server needs a hot fix
        logger.error(
            `Unexpected error occurred inside the controller of GET /Fragments/?expand=1 route`
        );
        logger.debug(err);
        res.status(501).json(response.createErrorResponse(501, 'Internal error'));
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
        res.set({ 'Content-Type': result.type }).status(200).send(data);
    } catch (error) {
        if (error.message === 'The result is undefined') {
            res.status(404).json(response.createErrorResponse(404, 'Could not find the object'));
        } else {
            // This should never run at all, cannot be tested
            logger.error(
                `Unexpected error occurred inside the controller of GET /fragments/:id route`
            );
            logger.debug(error);
            res.status(500).json(response.createErrorResponse(500, 'Internal error'));
        }
    }
};

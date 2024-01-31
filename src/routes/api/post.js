const { Fragment } = require('../../models/fragment');
const response = require('../../response');
const logger = require('../../logger');
/**
 * Get a list of fragments for the current user
 */
exports.postCreateFragment = async function (req, res) {
    try {
        logger.info(req);
        logger.info(req.email);
        logger.info(req.user);
        const fragment = new Fragment({
            ownerId: req.user,
            type: req.headers['content-type'],
        });
        const rawBody = req.body;
        await fragment.save();
        await fragment.setData(rawBody);
        console.info(`Line 19`);
        res.status(200).json(
            response.createSuccessResponse({
                status: 'ok',
                fragment: JSON.stringify(fragment),
            })
        );
    } catch (err) {
        logger.error(err);
        res.status(400).json(
            response.createErrorResponse(400, `The fragment was not properly created.`)
        );
    }
};

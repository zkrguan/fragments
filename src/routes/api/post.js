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
        res.location(`http://${req.headers.host}/v1/fragments/${fragment.id}`);
        res.status(201).json(
            response.createSuccessResponse({
                status: 'ok',
                fragment: fragment,
            })
        );
    } catch (err) {
        logger.error(err);

        if (err === 'No matching type') {
            res.status(415).json(
                response.createErrorResponse(
                    415,
                    'The fragment was not created! The media type is not supported.'
                )
            );
        } else {
            res.status(400).json(
                response.createErrorResponse(
                    400,
                    `The fragment was not created, your fragment could be empty.`
                )
            );
        }
    }
};

const { Fragment } = require('../../models/fragment');
const response = require('../../response');
const logger = require('../../logger');
/**
 * Get a list of fragments for the current user
 */
exports.postCreateFragment = async function (req, res) {
    try {
        const fragment = new Fragment({
            ownerId: req.user,
            type: req.headers['content-type'],
        });
        var rawBody = req.body;
        await fragment.setData(rawBody);
        await fragment.save();
        // In linux, this http will be added twice for some reasons.
        if (process.env.AWS_REGION)
            res.location(`${process.env.API_URL}/v1/fragments/${fragment.id}`);
        else res.location(`http://${process.env.API_URL}/v1/fragments/${fragment.id}`);
        res.status(201).json(
            response.createSuccessResponse({
                fragment: fragment,
            })
        );
    } catch (err) {
        if (err === 'No matching type') {
            res.status(415).json(
                response.createErrorResponse(
                    415,
                    'The fragment was not created! The media type is not supported.'
                )
            );
        } else {
            logger.error(`Unexpected error occured in POST fragments/ route`);

            logger.error(`-------------------------------------------------`);
            logger.error(err);
            logger.error(`-------------------------------------------------`);
            res.status(400).json(
                response.createErrorResponse(
                    400,
                    `The fragment was not created, your fragment could be empty.`
                )
            );
        }
    }
};

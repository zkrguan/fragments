const response = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../models/fragment');

exports.deleteOneFragment = async function (req, res) {
    const id = req.params['id'];
    const user = req.user;
    try {
        // See if this will caused the exception
        await Fragment.byId(user, id); //
        await Fragment.delete(user, id);
        res.status(200).json(response.createSuccessResponse(200, 'Success!'));
    } catch (error) {
        if (
            error.message.search('missing entry') !== -1 ||
            error.message === 'The result is undefined'
        ) {
            res.status(404).json(response.createErrorResponse(404, 'Result can not be found'));
        } else {
            // When memories run out or other bad situations this could happen.
            logger.error(`Internal error triggered!`);
            console.error(error);
            res.status(500).json(response.createErrorResponse(500, 'server error'));
        }
    }
};

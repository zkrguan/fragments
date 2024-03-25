const response = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../models/fragment');

exports.deleteOneFragment = async function (req, res) {
    const id = req.params['id'];
    const user = req.user;
    try {
        if (id) {
            // Fragment.delete(user, id);
            await Fragment.deleteOneFragment(user, id);
        } else {
            throw Error('ID is undefined!');
        }
    } catch (error) {
        if (error.message === 'ID is undefined!') {
            res.status(401).json(response.createErrorResponse(401, 'Bad input, ID is undefined'));
        } else {
            logger.error(`Internal error triggered!`);
            res.status(500).json(response.createErrorResponse(500, 'server error'));
        }
    }
};

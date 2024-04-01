const response = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../models/fragment');

exports.putUpdateOneFragment = async function (req, res) {
    const id = req.params['id'];
    const user = req.user;
    try {
        if (id) {
            // See if this will caused the exception
            const foundRecord = await Fragment.byId(user, id);
            if (foundRecord) {
                const trimmedType = foundRecord.type.includes(';')
                    ? foundRecord.type.substr(0, foundRecord.type.search(';'))
                    : foundRecord.type;
                const isMatched = foundRecord.type.substring().search(trimmedType) !== -1;
                if (isMatched) {
                    // Tried to use the OOP way to complete the update process
                    const foundFragment = new Fragment({
                        id: foundRecord.id,
                        ownerId: foundRecord.ownerId,
                        created: foundRecord.created,
                        updated: foundRecord.updated,
                        type: foundRecord.type,
                    });
                    foundFragment.setData(req.body);
                    foundFragment.save();
                } else {
                    throw new Error('Content type mismatched');
                }
            } else {
                throw new Error('The result is undefined');
            }
            res.status(200).json(
                response.createSuccessResponse({ status: 200, message: 'updated successfully' })
            );
        } else {
            throw new Error('ID is undefined!');
        }
    } catch (error) {
        if (error.message === 'ID is undefined!') {
            res.status(401).json(response.createErrorResponse(401, 'Bad input, ID is undefined'));
        } else if (error.message === 'The result is undefined') {
            res.status(404).json(response.createErrorResponse(404, 'Result can not be found'));
        } else if (error.message === 'content type mismatched') {
            res.status(400).json(
                response.createErrorResponse(
                    404,
                    'The request contain different type than existed object type'
                )
            );
        } else {
            logger.error(`Internal error triggered!`);
            console.error(error);
            res.status(500).json(response.createErrorResponse(500, 'server error'));
        }
    }
};

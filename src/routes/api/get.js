const { Fragment } = require('../../models/fragment');
const response = require('../../response');
const logger = require('../../logger');
const { supportedConversion } = require('../../configs/settings');
const markdownit = require('markdown-it');
const md = markdownit();
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
        console.log(id);
        if (id.includes('.')) {
            const index = id.search(/\./);
            const trimmedId = id.substring(0, index);
            const extension = id.substring(index);
            const result = await Fragment.byId(req.user, trimmedId);
            if (supportedConversion[result.type].find((ele) => ele === extension) !== undefined) {
                const dataObject = await conversionHelper(result, extension);
                res.set({ 'Content-Type': dataObject.contentType })
                    .status(200)
                    .send(dataObject.rawData);
            } else {
                throw 'not supported';
            }
        } else {
            const result = await Fragment.byId(req.user, id);
            const data = await result.getData();
            res.set({ 'Content-Type': result.type }).status(200).send(data);
        }
    } catch (error) {
        if (error.message === 'The result is undefined') {
            res.status(404).json(response.createErrorResponse(404, 'Could not find the object'));
        } else if (error.message === 'not supported') {
            res.status(404).json(
                response.createErrorResponse(404, 'This conversion is not supported')
            );
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

exports.getOneFragmentByIdWithInfo = async function (req, res) {
    const id = req.params['id'];
    try {
        res.status(200).json(
            response.createSuccessResponse({
                status: 'ok',
                fragments: await Fragment.byId(req.user, id),
            })
        );
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

const conversionHelper = async (sourceObject, outputType) => {
    var data = await sourceObject.getData();
    const resultObject = {
        rawData: data,
        contentType: '',
    };
    // This is to handle change the content-type in the returned
    // Be aware some cases like converting md to html. => Will change the data from the result object.
    switch (outputType) {
        case '.txt':
            resultObject.rawData = md.renderInline(data.toString('utf-8'));
            resultObject.contentType = 'text/plain';
            break;
        case '.html':
            // Update result object with HTML data and content type
            resultObject.rawData = md.render(data.toString('utf-8'));
            resultObject.contentType = 'text/html';
            break;
        // Add cases for other output types as needed
        // Impossible to have any cases because validated before this step
    }
    return resultObject;
};

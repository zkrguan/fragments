const { Fragment } = require('../../models/fragment');
const response = require('../../response');
const logger = require('../../logger');
const { supportedConversion } = require('../../configs/settings');
const markdownit = require('markdown-it');
const { readFragmentData } = require('../../models/data/index');
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
        console.log(38, 39);
        console.log(`inside teh getOneFragmentByid`);
        console.log(id);
        console.log(req.user);
        if (id.includes('.')) {
            console.log(`in 41`);
            const index = id.search(/\./);
            const trimmedId = id.substring(0, index);
            const extension = id.substring(index);
            const result = await Fragment.byId(req.user, trimmedId);
            const trimmedType = result.type.includes(';')
                ? result.type.substr(0, result.type.search(';'))
                : result.type;
            if (supportedConversion[trimmedType].find((ele) => ele === extension) !== undefined) {
                const dataObject = await conversionHelper(result, extension);
                res.set({ 'Content-Type': dataObject.contentType })
                    .status(200)
                    .send(dataObject.rawData);
            } else {
                throw new Error('not supported');
            }
        } else {
            console.log(`in 58`);
            const result = await Fragment.byId(req.user, id);
            console.log(result);
            if (result) {
                var data = await readFragmentData(req.user, id);
                res.set({ 'Content-Type': result.type }).status(200).send(data);
            } else {
                throw Error('The result is undefined');
            }
            // ----------Bug is here
            // result is not
            // ----------Bug is here
            // res.set({ 'Content-Type': result.type }).status(200).send(`done`);
        }
    } catch (error) {
        if (error.message === 'The result is undefined') {
            res.status(404).json(response.createErrorResponse(404, 'Could not find the object'));
        } else if (error.message === 'not supported') {
            res.status(415).json(
                response.createErrorResponse(415, 'This conversion is not supported')
            );
        } else {
            // This should never run at all, cannot be tested
            // logger.error(
            //     `Unexpected error occurred inside the controller of GET /fragments/:id route`
            // );
            // logger.debug(error);
            console.log(error);
            res.status(500).json(response.createErrorResponse(500, 'Internal error'));
        }
    }
};

exports.getOneFragmentByIdWithInfo = async function (req, res) {
    const id = req.params['id'];
    try {
        const result = await Fragment.byId(req.user, id);
        if (result) {
            res.status(200).json(
                response.createSuccessResponse({
                    status: 'ok',
                    fragment: result,
                })
            );
        } else {
            throw Error('The result is undefined');
        }
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
            resultObject.contentType = 'text/plain';
            break;
        case '.html':
            // Update result object with HTML data and content type
            resultObject.rawData = md.render(data.toString('utf-8'));
            resultObject.contentType = 'text/html';
            break;
        case '.json':
            if (sourceObject.type.toLowerCase().includes('text/csv')) {
                // resultObject.rawData =
                resultObject.rawData = csvJSON(data.toString('utf-8'));
                // Parse CSV data
                // Convert parsed data to JSON
            }
            resultObject.contentType = 'application/json';
            // Add cases for other output types as needed
            // Impossible to have any cases because validated before this step
            break;
    }
    return resultObject;
};

// CSV parser Helper from stack-overflow
// https://stackoverflow.com/questions/27979002/convert-csv-data-into-json-format-using-javascript
const csvJSON = (csv) => {
    const rows = csv.trim().split('\n'); // Split the string into rows
    const headers = rows[0].split(',').map((header) => header.trim()); // Extract headers and remove leading/trailing spaces
    const data = [];

    // Start from index 1 to skip the headers
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',').map((value) => value.trim()); // Split each row into values and remove leading/trailing spaces
        const rowData = {};
        for (let j = 0; j < headers.length; j++) {
            rowData[headers[j]] = row[j]; // Create an object with header-value pairs
        }
        data.push(rowData); // Push the row data into the result array
    }

    return data;
};

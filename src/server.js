// We want to gracefully shutdown our server
const stoppable = require('stoppable');

// Get our logger instance
const logger = require('./logger');

// Get our express app instance
const app = require('./app');

// Get the desired port from the process' environment. Default to `8080`
const port = parseInt(process.env.PORT || '8080', 10);

// Start a server listening on this port
const server = stoppable(
    app.listen(port, () => {
        // Log a message that the server has started, and which port it's using.
        // RG: I honestly think this is useless.
        logger.info('the processes variables are listed below');
        logger.info(process.env);
        logger.info('the end of the process env variables');
        logger.info(`My lil server is listening on port ${port}`);
    })
);

// Export our server instance so other parts of our code can access it if necessary.
module.exports = server;

// jest.config.js

// Get the full path to our env.jest file
const path = require('path');
// That dot before env does matter.
const envFile = path.join(__dirname, '.env.jest');

// Read the environment variables we use for Jest from our env.jest file
require('dotenv').config({ path: envFile });

// Log a message to remind developers how to see more detail from log messages

// Set our Jest options, see https://jestjs.io/docs/configuration
module.exports = {
    verbose: true,
    bail: 1,
    testTimeout: 5000,
};

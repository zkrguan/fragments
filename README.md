# fragments

My work repo while learning AWS for developer.

## Scripts

"test:watch": "jest -c jest.config.js --runInBand --watch --",
 
"test": "jest -c jest.config.js --runInBand --",

"coverage": "jest -c jest.config.js --runInBand --coverage",

"lint": "eslint --config .eslintrc.js \"./src/**/*.js\"",

"start": "node src/index.js",

"dev": " cross-env LOG_LEVEL=debug nodemon ./src/index.js --watch src",

"debug": " cross-env  LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/index.js --watch src"

## Timeline

Milestone 1 repo set up done by Jan 15 2024.

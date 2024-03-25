// If the environment sets an AWS Region, we'll use AWS backend
// services (S3, DynamoDB); otherwise, we'll use an in-memory db.
if (process.env.AWS_REGION) console.log(`using aws`);
else console.log(`Using memory DB`);
module.exports = process.env.AWS_REGION ? require('./aws') : require('./memory');

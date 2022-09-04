const { Hop } = require('@onehop/js')
const dotenv = require('dotenv')
dotenv.config()
const myToken = process.env.PROJECT_TOKEN;
// Export the Hop SDK instance so you can use it throughout your codebase
module.exports = new Hop(myToken);
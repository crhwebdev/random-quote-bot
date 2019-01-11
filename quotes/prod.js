//for now, we are storing quotes in an environmental variable on the server
module.exports = JSON.parse(process.env.quotes);

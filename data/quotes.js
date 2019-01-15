const keys = require('../config/keys');

module.exports = async function() {
  let quotes = [];
  if (keys.database) {
    //TODO: connect to the database and pull out all quotes
    return quotes;
  } else {
    if (process.env.NODE_ENV === 'production') {
      quotes = JSON.parse(process.env.quotes);
    } else {
      quotes = require('./local.json');
    }

    return quotes;
  }
};

const Discord = require('discord.js');
const keys = require('./config/keys');
const quotes = require('./quotes/quote');
const client = new Discord.Client();

const getRandomQuote = quoteArray => {
  let randomIndex = Math.floor(
    Math.random() * Math.floor(quoteArray.length - 1)
  );
  return quoteArray[randomIndex];
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === '!ping') {
    msg.reply(getRandomQuote(quotes));
  }
});

client.login(keys.discordToken);

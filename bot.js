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

client.on('message', message => {
  if (message.content.startsWith('!quote')) {
    let user = message.mentions.users.first();
    if (user) {
      // console.log(user);
      message.channel.send('<' + '@' + user.id + '>' + getRandomQuote(quotes));
    } else {
      message.channel.send(getRandomQuote(quotes));
    }
    message.delete(10).catch(console.error);
  }
});

client.login(keys.discordToken);

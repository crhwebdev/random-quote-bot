const Discord = require('discord.js');
const keys = require('./config/keys');
const quotes = require('./data/quotes');
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
  const command = keys.commandName || 'quote';
  if (message.content.startsWith('!pm' + command)) {
    let user = message.mentions.users.first();
    if (user) {
      user.send(getRandomQuote(quotes));
    } else {
      console.error('Tried to use !pmquote without a user name');
    }
    message.delete(10).catch(console.error);
  } else if (message.content.startsWith('!' + command)) {
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

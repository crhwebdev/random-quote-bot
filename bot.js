const keys = require('./config/keys');
const quotes = require('./data/quotes');

const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

const Discord = require('discord.js');
const client = new Discord.Client();

const getRandomQuote = quoteArray => {
  let randomIndex = Math.floor(
    Math.random() * Math.floor(quoteArray.length - 1)
  );
  return quoteArray[randomIndex];
};

client.on('ready', () => {
  logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  const command = keys.commandName.toLowerCase() || 'quote';

  if (message.content.toLowerCase().startsWith('!pm' + command)) {
    let user = message.mentions.users.first();
    if (user) {
      user.send(getRandomQuote(quotes));
    } else {
      logger.error(
        `${message.author} tried to use !pmquote without a user name`
      );
    }
    message.delete(10).catch(console.error);
  } else if (message.content.toLowerCase().startsWith('!' + command)) {
    let user = message.mentions.users.first();
    if (user) {
      message.channel.send('<' + '@' + user.id + '>' + getRandomQuote(quotes));
    } else {
      message.channel.send(getRandomQuote(quotes));
    }
    message.delete(10).catch(console.error);
  }
});

client.login(keys.discordToken);

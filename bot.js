const keys = require('./config/keys');

const winston = require('winston');

const loggerFormat = winston.format.printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), loggerFormat),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

//Setup data
const Quotes = require('./data/quotes.js');

const bot = async function() {
  const quotes = await Quotes();
  //setup Discord client
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
        message.channel.send(
          '<' + '@' + user.id + '>' + getRandomQuote(quotes)
        );
      } else {
        message.channel.send(getRandomQuote(quotes));
      }
      message.delete(10).catch(console.error);
    }
  });

  client.login(keys.discordToken);
};

bot();

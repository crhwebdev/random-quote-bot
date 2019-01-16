const keys = require('./config/keys');

//configure logger
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

//function to retrieve a random quote
const getRandomQuote = quoteArray => {
  let randomIndex = Math.floor(
    Math.random() * Math.floor(quoteArray.length - 1)
  );
  return quoteArray[randomIndex];
};

//function to setup and run bot
const bot = async function() {
  //Setup data for application
  const Quotes = require('./data/quotes.js');
  const quotes = await Quotes();

  if (!quotes || quotes.length < 1) {
    logger.error('No quotes available!');
    console.log('ERROR: no quotes available!');
    process.exit(1);
  }

  //setup Discord client
  const Discord = require('discord.js');
  const client = new Discord.Client();

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
      const users = message.mentions.users;
      let mentionsTag = '';
      if (users.first()) {
        for (user of users) {
          /* must call to user[1].id instead of user.id because iterated user
           is an array starting with user id and then user object */
          mentionsTag += '<@' + user[1].id + '>' + ',';
        }
        //remove trailing comma
        mentionsTag = mentionsTag.substring(0, mentionsTag.length - 1);
      }
      message.channel.send(getRandomQuote(quotes) + mentionsTag);
      message.delete(10).catch(console.error);
    }
  });

  client.login(keys.discordToken);
};

bot();

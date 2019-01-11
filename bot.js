const Discord = require('discord.io');
const logger = require('winston');
const keys = require('./config/keys');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true
});

logger.level = 'debug';
// Initialize Discord Bot
const bot = new Discord.Client({
  token: keys.discordToken,
  autorun: true
});

bot.on('ready', evt => {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', (user, userID, channelID, message, evt) => {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 1) == '!') {
    let args = message.substring(1).split(' ');
    let cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      // !ping
      case 'ping':
        bot.sendMessage({
          to: channelID,
          message: 'Pong!'
        });
        break;
      // Just add any case commands if you want to..
    }
  }
});

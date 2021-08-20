'use strict';

require(`dotenv`).config();
const TelegramBot = require(`node-telegram-bot-api`);

const token = process.env.TG_TOKEN;
const chatId = process.env.TG_CHAT_ID;

const tgNotifier = new TelegramBot(token, {polling: true});

const notify = (message) => tgNotifier.sendMessage(chatId, message);

module.exports = notify;

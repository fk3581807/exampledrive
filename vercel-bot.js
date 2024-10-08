const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();

const TOKEN = '7828935928:AAEZagEM2dQoKGeeIfI6swcJlGWvQn8EqgI';
const GOOGLE_DRIVE_API_KEY = 'AIzaSyB2Gi6A21kfBvBDs3MRfF5yKrp-nxmRbLQ';


const bot = new TelegramBot(TOKEN, { polling: true });

app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Enter a Google Drive file link:');
});

bot.on('message', (msg) => {
  const link = msg.text;
  const fileId = extractFileId(link);

  if (fileId) {
    const downloadLink = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${GOOGLE_DRIVE_API_KEY}`;
    bot.sendMessage(msg.chat.id, `Direct Download Link: ${downloadLink}`, {
      caption: 'Direct Download Link',
    });
  } else {
    bot.sendMessage(msg.chat.id, 'Invalid Google Drive file link format.');
  }
});

function extractFileId(link) {
  const regex = /\/file\/d\/([^\/]+)/;
  const match = link.match(regex);
  return match && match[1];
}

module.exports = app;

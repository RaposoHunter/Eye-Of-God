require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN || null;
const eyeOfGod = new TelegramBot(token, { polling: true });

eyeOfGod.search = require("./comandos/search.js");

eyeOfGod.on("message", msg => {  
  const chatId = msg.chat.id;
  const msgTxt = msg.text;
  const requester_username = msg.from.username !== undefined ? "@" + msg.from.username : msg.from.first_name;

  const args = msgTxt.trim().split(/ +/);
  const cmd = args.shift();

  if (cmd == "/search" || cmd == "/search@GodsEye_chat_bot" || cmd == "/search_rand" || cmd == "/search_rand@GodsEye_chat_bot") {
    let isRand = false;
    if(cmd == "/search_rand" || cmd == "/search_rand@GodsEye_chat_bot") isRand = true;
    
    try {
      eyeOfGod.search.execute(eyeOfGod, chatId, requester_username, args, isRand);
    } catch (e) {
      console.log(e);
      eyeOfGod.sendMessage(chatId, "Algo deu errado na execução do comando...");
    }
  }
});

require("dotenv").config();
const fs = require("fs");

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN || null;
const eyeOfGod = new TelegramBot(token, {polling: true});

eyeOfGod.commands = require("./commandsObj.js");

const commandFiles = fs.readdirSync("./comandos").filter(file => file.endsWith(".js"));

for(let file of commandFiles) {

	let command = require(`./comandos/${file}`);
	eyeOfGod.commands[command.name] = command;
}

eyeOfGod.onText(/\/(.+)/, (msg, match) => {
	const chatId = msg.chat.id;
	const hasAtSign = match[1].indexOf("@") != -1;
	let args;
	let cmd;

	if(hasAtSign) {
		args = match[1].trim().split("@GodsEye_chat_bot");
		cmd = args.shift().toLowerCase();
		args[0] = args[0].trim();
		args = args[0].split(/ +/);
		
	} else {
		args = match[1].trim().split(/ +/);
		cmd = args.shift().toLowerCase();
	}

	if(!eyeOfGod.commands.has(cmd)) return eyeOfGod.sendMessage(chatId, "Desculpe, não conheço esse comando...");
	
	try {
		eyeOfGod.commands[cmd].execute(eyeOfGod, chatId, args);
	} catch(e) {
		console.log(e);
		eyeOfGod.sendMessage(chatId, "Algo deu errado na execução do comando...");
	}
});

/*
eyeOfGod.on("message", msg => {
	const chatId = msg.chat.id;
	console.log(msg);
});
*/
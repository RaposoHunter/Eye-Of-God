const https = require("https");
const fs = require("fs");
const gis = require("g-i-s");
//const filter = require("../filter.js");

module.exports = {
	name: "search",
	description: "/search: Envia a primeira imagem encontrada sobre o que foi para o comando",
	usage: "/search <pesquisa>",
	execute: async (bot, chatId, args) => {
		let search = args.join(" ");
	
		//let isPorn = filter(args[0]);
		//if(isPorn) return bot.sendMessage(chatId, "PAREM DE VER PORNOGRAFIA");

		if(!search.length) return bot.sendMessage(chatId, "Você esqueceu de dizer o que queria pesquisar...");

		const download = async (queue, path) => new Promise((resolve, reject) => {
			gis(queue, (err, res) => {
				if(err) console.log(err);
				else {
					let URL;
					const file = fs.createWriteStream(path);
					
					for (let img of res) {
						if (img.url[4] == "s") {
							URL = img.url;
							break;
						}
					}
		
					https.get(URL, res => {
						res.pipe(file);
		
						file.on("finish", () => {
							file.close(resolve(true));
						});
		
						file.on("error", err => {
							console.log(err);
							fs.unlink(path, () => {});
							reject(err.msg);
						});
					}).on("error", err => {
						console.log(err);
						fs.unlink(path, () => {});
						reject(err.msg);
					});
				}
			});
		});

		const sendToTelegram = async (imgTitle, imgPath) => {
			/*let args = imgTitle.split(" ");

			for(let i in args) {
				args[i][0].toUpperCase();
			}

			args = args.join(" ");*/
			let args = imgTitle;

			//await bot.sendMessage(chatId, args);
			await bot.sendPhoto(chatId, imgPath);
			await fs.unlink(imgPath, () => {});
		}

		bot.sendMessage(chatId, `Procurarei pela primeira imagem sobre "${search}". Aguarde... \u{231B}`);

		const imgPath = `./imagens_temporarias/${search}.png`

		await download(search, imgPath);
		await sendToTelegram(search, imgPath);
	}
}

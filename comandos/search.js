const puppeteer = require("puppeteer");
const https = require("https");
const fs = require("fs");
const download = require("base64-to-image");

module.exports = {
	name: "search",
	description: "/search: Envia a primeira imagem encontrada sobre o que foi para o comando",
	usage: "/search <pesquisa>",
	execute: (bot, chatId, args) => {
		args[0] = args.join(" ");
		//console.log(args);
		if(!args[0].length) return bot.sendMessage(chatId, "Você esqueceu de dizer o que queria pesquisar...");

		bot.sendMessage(chatId, `Procurarei pela primeira imagem sobre "${args[0]}". Aguarde... \u{231B}`)

		/*const download = async (base64URL, filePath, optinalFileOptions) => {
			await base64ToImage(base64URL, filePath, optinalFileOptions);
		};*/

		const sendToTelegram = async (imgPath, imgDescription) => {
			/*await msg.channel.bulkDelete(1, true).catch(err => {
				console.log(err);
			});*/

			await bot.sendMessage(chatId, imgDescription);
			await bot.sendPhoto(chatId, imgPath);
			await fs.unlink(imgPath, () => {});
		}

		// 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' // Rodar com Google Chrome
		(async () => {
			// Cria as variáveis do navegador e da página;
			const browser = await puppeteer.launch({headless: true});
			const page = await browser.newPage();

			// Pesquisa pelo que foi enviado ao bot e espera o termino da execução da função
			await page.goto("https://www.google.com/search?q=" + args[0]);

			// Recupera o botão de imagens dentre todos os outros
			let btn_href = await page.$$eval("a.q.qs", els => {
				let href;

				els.forEach((el, i) => {
					if(el.innerText == "Imagens") href = el.href
				})

				return href || null;
			});

			if(btn_href != null) {
				// Navega até a página das imagens
				await page.goto(btn_href)
				
				// Recupera o URL da primeira imagem e sua descrição
				let [img_href, img_alt] = await page.evaluate((sel) => {
					let img = document.querySelector(sel);
					let source = img.getAttribute('src');
					let alt = img.getAttribute('alt');
					//let link = source.replace("/", "");

					return [source, alt];
				}, ".rg_i.Q4LuWd");

				// Envia os dados para o Telegram
				let img_path = "./imagens_temporarias/";
				await download(img_href, img_path, {fileName: args[0], type: "png"});

				img_path += args[0] + ".png";
				await sendToTelegram(img_path, img_alt);
			}

			// Fecha o navegador
			await browser.close();
		})();
	}
}
const https = require("https");
const gis = require("g-i-s");
//const filter = require("../filter.js");

module.exports = {
	name: "search",
	description: "/search: Envia a primeira imagem encontrada sobre o que foi para o comando",
	usage: "/search <pesquisa>",
	execute: async (bot, chatId, requester_username, args, isRand = false) => {
		let search = args.join(" ");
    
		if(!search.length) return bot.sendMessage(chatId, "Você esqueceu de dizer o que queria pesquisar...");

		const downloadAndSendToTelegram = async (queue, queueID) => {      
      gis(queue, async (err, res) => {
				if(err) { 
					console.log(err);
					bot.sendMessage(chatId, "Algo deu errado durante a execução do comando...");
				} else {
					let URL;
					let notCompatible = true;
          let img;
          let i = 0;
      
          if(isRand) {
            do {
              let index = Math.floor(Math.random() * res.length);
              img = res[index];

              notCompatible = img.url.indexOf(".svg") != -1 || (img.url.indexOf(".png") == -1 && img.url.indexOf(".jpg") == -1);
            } while(notCompatible);
          } else {
            do {
              img = res[i];

              notCompatible = img.url.indexOf(".svg") != -1 || (img.url.indexOf(".png") == -1 && img.url.indexOf(".jpg") == -1);
              i++;
            } while(notCompatible);
          }
          
          URL = img.url;
          
          let newSearch = [];
          args.forEach((str, i) => {
            newSearch[i] = str.replace(str[0], str[0].toUpperCase()); 
          });

          newSearch = newSearch.join(" ");
		      
          await bot.sendMessage(chatId, `${requester_username}, aqui está uma imagem sobre "${newSearch}"": ${URL}`);
          bot.deleteMessage(chatId, queueID);
				}
			});
		};

		let nMsg = await bot.sendMessage(chatId, `Procurarei pela primeira imagem sobre "${search}". Aguarde... \u{231B}`);
  
		await downloadAndSendToTelegram(search, nMsg.message_id);
	}
}

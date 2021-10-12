require('dotenv').config()
const axios= require('axios')

const { Client, Intents } = require('discord.js');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.on('guildMemberAdd', (member)=>{
	const rulesChannel = "894852972117372988";
	member.guild.channels.cache.get("892043307738341386").send(`Welcome to the server <@${member.id}>. Be sure to checkout the rules ${member.guild.channels.cache.get(rulesChannel).toString()}`);
})

var fs = require('fs');

client.on("messageCreate", messageManager);

async function messageManager(msg){
	if (msg.author.bot) return

	if(msg.channel.id){
		var token = msg.content.split(" ");
		if(token[0] == "!roboedit"){
			fs.readFile('MSG.txt', 'utf8', function(err, data) {
				if (err) throw err;

       msg.channel.messages.fetch( 
         //in around put the ID of the message which you want to edit//
         {around:"895755842169761833" , limit: 1})
        .then(msg => {
          const fetchedMsg = msg.first();
          fetchedMsg.edit(data);
        });
			});	
		}
		if(token[0] == "!robosend"){
			fs.readFile('MSG.txt', 'utf8', function(err, data) {
				if (err) throw err;
        client.channels.cache.get('892043307738341386').send(data);
			});	
		}

    if(token[0] == "!mscruleset"){
			if(msg.bot) return;
			
      msg.reply("https://bit.ly/2FprBJq");
			
		}

    if(token[0] == "!smsruleset"){
			if(msg.bot) return;
			
      msg.reply("http://bit.ly/3jvMGBV");
			
		}

		if(token[0] == "!mscrating"){
			const url = "https://docs.google.com/spreadsheets/d/1ruQJgxLDnpGT1r41RqHV9m5079OsL0DJa2-aVdFpyFI/gviz/tq?";
			axios.get(url)
			.then(function (response) {
				const data = JSON.parse(response.data.substr(47).slice(0,-2));
				const newData = [];

				data.table.rows.map((main)=>{
					newData.push(main.c[0].v);
				})
				msg.reply(newData.join('\n'));
				// I need this data here
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
		}

		if(token[0] == "!smsrating"){
			const url2 = "https://docs.google.com/spreadsheets/d/15LKDoDK9K1UfSp0bDGCNUUeQDtccZIQYqheRBq4WFPo/gviz/tq?";
			
			if(msg.bot) return;
			axios.get(url2)
			.then(function (response) {
				const data = JSON.parse(response.data.substr(47).slice(0,-2));
				const newData2 = [];

				data.table.rows.map((main)=>{
					newData2.push(main.c[0].v);
				})
				msg.reply(newData2.join('\n'));
				// I need this data here ^^
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
		}
	}
}

//REACTION ROLES
client.on('messageReactionAdd', async (reaction, user) => {
  console.log("new Reaction add");
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		try { 
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	const member = reaction.message.guild.members.cache.get(user.id);

	if(reaction.message.id == "896450856298381312"){
		const role1 = "862237914863239198";
		const role2 = "680810288605298744";
		if(reaction.emoji.name == '✅'){
			member.roles.add(role1);
		}
		if(reaction.emoji.id == '712278814163730452'){
			member.roles.add(role2);
		}
	}

	if(reaction.message.id == "896450908928507965"){
		const role3= "862237991635124244";
		const role4 = "781487757176209428";
		if(reaction.emoji.name== '✅'){
			member.roles.add(role3);
		}
		if(reaction.emoji.id == '781493087342952479'){
			member.roles.add(role4);
		}
	}

	if(reaction.message.id == "896450949474816100"){
		const role5 = "862238161395908628";
		if(reaction.emoji.name == '🏆'){
			member.roles.add(role5);
		}		
	}

	if(reaction.message.id == "896450993531801672"){
		const role6 = "862238264752996372";
		if(reaction.emoji.name == '🧩'){
			member.roles.add(role6);
		}
	}
});

client.on("messageReactionRemove", (reaction, user)=> {
	const member = reaction.message.guild.members.cache.get(user.id);
  if(reaction.message.id == "896450856298381312"){
		if(reaction.emoji.name == '✅'){
			member.roles.remove("862237914863239198");
		}
		if(reaction.emoji.id == '712278814163730452'){
      console.log("mscball reaction removed")
			member.roles.remove("680810288605298744");
		}
	}

	if(reaction.message.id == "896450908928507965"){
		if(reaction.emoji.name == '✅'){
			member.roles.remove("862237991635124244");
		}
		if(reaction.emoji.id == '781493087342952479'){
      console.log('sms ball reaction removed')
			member.roles.remove("781487757176209428");
		}
	}

	if(reaction.message.id == "896450949474816100"){
		if(reaction.emoji.name == '🏆'){
			member.roles.remove("862238161395908628");
		}
	}

  if(reaction.message.id == "896450993531801672"){
		if(reaction.emoji.name == '🧩'){
			member.roles.remove("862238264752996372");
		}
	}
})

client.login(process.env.BOT_TOKEN)
require('dotenv').config()
const axios = require('axios')

const { Client, Intents, Collection} = require('discord.js');
const {SlashCommandBuilder} = require('@discordjs/builders')


const CONSTANTS = require('./constants');
const {config} = require('./sql_config')
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

// stadium listing
const stadiums = ['The Classroom', 'The Sand Tomb', 'The Palace', 'Thunder Island', 'Pipeline Central', 'Konga Coliseum', 'The Underground', 'The Wastelands',
	'Crater Field', 'The Dump', 'The Vice', 'Crystal Canyon', 'The Battle Dome', 'The Lava Pit', 'Galactic Stadium', 'Bowser Stadium', 'Stormship Stadium'];

// i believe this doesn't work/it's not currently enabled
client.on('guildMemberAdd', (member) => {
	const rulesChannel = "894852972117372988";
	member.guild.channels.cache.get("892043307738341386").send(`Welcome to the server <@${member.id}>. Be sure to checkout the rules ${member.guild.channels.cache.get(rulesChannel).toString()}`);
});

var fs = require('fs');

let sql = require('mssql');

let rando = 0;

// time in minutes that cronJob will run
const interval = 30;

client.commands = new Collection()
const commandFiles = fs.readdirSync('./commands')
commandFiles.forEach(file => {
        require(`./commands/${file}`).commands.forEach(command => client.commands.set(command.data.name,command))
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


client.on("ready", cronJob);


async function cronJob() {
  // set status to Playing at X, where X is a random stadium from MSC/SMS
  client.user.setActivity('at ' + stadiums[rando], { type: 'PLAYING' });

	rando = Math.floor(Math.random() * 17);

	// repeat every X minutes, where X is interval's value
	setTimeout(cronJob, 60000 * interval);
}

// validates the role, will be used for some commands to make sure an admin is running it
async function roleValidator(client, authorId, acceptedRoles) {
	let validation = false;
	const strikersGuild = client.guilds.cache.get(CONSTANTS.GUILD_ID);
	await strikersGuild.members.fetch(authorId)
		.then((user) => {
			user._roles.forEach(userRole => {
				if (acceptedRoles.includes(userRole)) {
					validation = true;
					return;
				}
			});
		});
	return validation
}

client.on("messageCreate", messageManager);

async function messageManager(msg) {
	if (msg.author.bot) return

	if (msg.channel.id) {
		var token = msg.content.split(" ");

		if (token[0] == "!roboedit") {
			fs.readFile('msg_send.txt', 'utf8', function (err, data) {
				if (err) throw err;

				msg.channel.messages.fetch(
					//in around put the ID of the message which you want to edit//
					{ around: "895755842169761833", limit: 1 })
					.then(msg => {
						const fetchedMsg = msg.first();
						fetchedMsg.edit(data);
					});
			});
		}

		else if (token[0] == "!robosend") {
			fs.readFile('msg_send.txt', 'utf8', function (err, data) {
				if (err) throw err;
				client.channels.cache.get('892043307738341386').send(data);
			});
		}

		else if (token[0] == "!sandbox") {
			fs.readFile('msg_sandbox.txt', 'utf8', function (err, data) {
				if (err) throw err;
				client.channels.cache.get('897757084299431936').send(data);
			});
		}

		// function allows for the creation of new one-off commands - good for showing bracket images or answering frequently asked questions
		else if (token[0] == "!upsertcommand") {
			try {
				sql.connect(config, function (err) {
					var request = new sql.Request();

					let param = "";

					for (let i = 2; i < token.length; i++) {
						param += token[i] + " ";
					}

					let query = "exec UpsertCommand @token, @response";

					request.input('token', token[1]);
					request.input('response', param);

					request.query(query, function (err, recordset) {
						if (err) console.log(err)
					});
				})

				msg.react('☑️');
			}

			catch (error) {
				console.log(error);
				msg.react('❌');
			}
		}

		// function removes one-off commands
		else if (token[0] == "!removecommand") {
			try {
				sql.connect(config, function (err) {
					var request = new sql.Request();

					let query = "delete from discordCommands where token = @token";

					request.input("token", "!" + param[1]);

					request.query(query, function (err, recordset) {
						if (err) console.log(err)
					});
				})

				msg.react('☑️');
			}

			catch (error) {
				console.log(error);
				msg.react('❌');
			}
		}

		// function displays the tier list for MSC
		else if (token[0] == "!tlmsc") {
			if (msg.bot) return;

			msg.channel.send("https://media.discordapp.net/attachments/806813942218883073/869189371847381022/unknown.png");
			msg.channel.send("https://media.discordapp.net/attachments/806813942218883073/869189471533400074/unknown.png");
		}

		// function shows the ratings of all active players for MSC
		else if (token[0] == "!mscrating") {
			try {
				sql.connect(config, function (err) {
					var request = new sql.Request();

					let query = "exec GetRatingsForDiscordMSC";
					request.query(query, function (err, recordset) {
						if (err) {
							console.log(err);
							msg.react('❌');
						}
						else {
							let data = recordset.recordset;
							const newData = [];
							for (let i = 0; i < recordset.recordset.length; i++) {
								newData.push(recordset.recordset[i].line);
								console.log(recordset.recordset[i].line);
							}

							msg.channel.send(newData.join('\n'));
						}
					})
				})
			}
			catch (error) {
				console.log(error);
				msg.react('❌');
			}
		}

		// function shows the ratings of all active players for SMS
		else if (token[0] == "!smsrating") {
			try {
				sql.connect(config, function (err) {
					var request = new sql.Request();

					let query = "exec GetRatingsForDiscordSMS";
					request.query(query, function (err, recordset) {
						if (err) {
							console.log(err);
							msg.react('❌');
						}
						else {
							let data = recordset.recordset;
							const newData = [];
							for (let i = 0; i < recordset.recordset.length; i++) {
								newData.push(recordset.recordset[i].line);
								console.log(recordset.recordset[i].line);
							}

							msg.channel.send(newData.join('\n'));
						}
					})
				})
			}
			catch (error) {
				console.log(error);
				msg.react('❌');
			}
		}

		// function shows the current MSL Rankings for MSC
		else if (token[0] == "!mslmsc") {
			const url3 = "https://docs.google.com/spreadsheets/d/1Cf5YggxcwNVMCTyQ1Xz7wC7OaOxVoC1rQIeEJSXo6s8/gviz/tq?";

			if (msg.bot) return;
			msg.channel.send("**MSL Season 1** — MSC Rankings");
			axios.get(url3)
				.then(function (response) {
					const data = JSON.parse(response.data.substr(47).slice(0, -2));
					const newData3 = [];

					data.table.rows.map((main) => {
						newData3.push(main.c[0].v);
					})
					msg.channel.send(newData3.join('\n'));
					// I need this data here ^^
					return response.data;
				})
				.catch(function (error) {
					console.log(error);
				});
		}

		// function shows the current MSL Rankings for SMS
		else if (token[0] == "!mslsms") {
			const url4 = "https://docs.google.com/spreadsheets/d/1elh4wTVHNR0dv-QNklaNLMUNU07VKuaFkZkU9G2XWQ0/gviz/tq?";

			if (msg.bot) return;
			msg.channel.send("**MSL Season 1** — SMS Rankings");
			axios.get(url4)
				.then(function (response) {
					const data = JSON.parse(response.data.substr(47).slice(0, -2));
					const newData4 = [];

					data.table.rows.map((main) => {
						newData4.push(main.c[0].v);
					})
					msg.channel.send(newData4.join('\n'));
					// I need this data here ^^
					return response.data;
				})
				.catch(function (error) {
					console.log(error);
				});
		}

		// function allows the user to report the score for a tournament (or ranked, eventually) match
		else if (token[0] == "!mscreport") {
			if (msg.bot) return;
			try {
				let score = "";

				// get the score and the discord ids if available
				let p1 = client.users.cache.get(token[1].replace("<", "").replace(">", "").replace("@", "").replace("!", ""));
				score = token[2];
				let p2 = client.users.cache.get(token[3].replace("<", "").replace(">", "").replace("@", "").replace("!", ""));

				// set the paramters - if the token isn't a discord tag, just get the text, otherwise get the id and username
				if (p1 == undefined)
					p1 = token[1];
				else
					p1 = token[1] + p1.username;

				if (p2 == undefined)
					p2 = token[3];
				else
					p2 = token[3] + p2.username;

				console.log(p1);
				console.log(p2);
				console.log(token.length);

				sql.connect(config, function (err) {
					// create the request object
					var request = new sql.Request();

					let query = "";

					if (token.length == 4)
						query = "exec reportScoreMSC @p1, @p2, @score;"
					/*
					else if (token.length == 5) {
						query = "exec reportScoreMSC '" + p1 + "', '" + p2 + "', '" + score + "', '" + token[4] + "';"
					}
					else if (token.length == 6) {
						query = "exec ReportScoreWithTourneyDetailsMSC '" + p1 + "', '" + p2 + "', '" + score + "', '" + token[4] + "', '" + token[5] + "', '';"
					}
					else if (token.length == 7) {
						query = "exec ReportScoreWithTourneyDetailsMSC '" + p1 + "', '" + p2 + "', '" + score + "', '" + token[4] + "', '" + token[5] + "', '" + token[6] + "';"
					}
					*/
					console.log(query);

					request.input("p1", p1);
					request.input("p2", p2);
					request.input("score", score);

					request.query(query, function (err, recordset) {
						if (err) console.log(err)
					})
				})

				// todo: broken, need to fix - also, add X or something if it fails
				msg.react('☑️');
			}
			catch (error) {
				console.log(error);
				msg.react('❌');
			}
		}

		// function allows the user to report the score for a tournament (or ranked, eventually) match
		else if (token[0] == "!smsreport") {
			if (msg.bot) return;
			try {
				let score = "";

				// get the score and the discord ids if available
				let p1 = client.users.cache.get(token[1].replace("<", "").replace(">", "").replace("@", "").replace("!", ""));
				score = token[2];
				let p2 = client.users.cache.get(token[3].replace("<", "").replace(">", "").replace("@", "").replace("!", ""));

				// set the paramters - if the token isn't a discord tag, just get the text, otherwise get the id and username
				if (p1 == undefined)
					p1 = token[1];
				else
					p1 = token[1] + p1.username;

				if (p2 == undefined)
					p2 = token[3];
				else
					p2 = token[3] + p2.username;

				console.log(p1);
				console.log(p2);
				console.log(token.length);

				sql.connect(config, function (err) {
					// create the request object
					var request = new sql.Request();

					let query = "";

					if (token.length == 4)
						query = "exec reportScoreSMS @p1, @p2, @score;"
					/*
					else if (token.length == 5) {
						query = "exec reportScoreSMS '" + p1 + "', '" + p2 + "', '" + score + "', '" + token[4] + "';"
					}
					else if (token.length == 6) {
						query = "exec ReportScoreWithTourneyDetailsSMS '" + p1 + "', '" + p2 + "', '" + score + "', '" + token[4] + "', '" + token[5] + "', '';"
					}
					else if (token.length == 7) {
						query = "exec ReportScoreWithTourneyDetailsSMS '" + p1 + "', '" + p2 + "', '" + score + "', '" + token[4] + "', '" + token[5] + "', '" + token[6] + "';"
					}
					*/
					console.log(query);

					request.input("p1", p1);
					request.input("p2", p2);
					request.input("score", score);

					request.query(query, function (err, recordset) {
						if (err) console.log(err)
					})
				})

				msg.react('☑️');
			}
			catch (error) {
				console.log(error);
				msg.react('❌');
			}
		}

		// display a one-off command as created by !upsertcommand
		else if (token[0].substring(0, 1) == "!") {
			if (msg.bot) return;
			try {
				sql.connect(config, function (err) {
					var request = new sql.Request();

					let query = "select * from DiscordCommands where Token = @token";
					request.input("token", token[0]);

					request.query(query, function (err, recordset) {
						if (err) {
							console.log(err);
							console.react('❌');
						}
						else {
							let data = recordset.recordset;
							if (recordset.recordset.length == 0) {
								return;
							}
							else {
								msg.channel.send(recordset.recordset[0].Response);
							}
						}
					})
				})
			}
			catch (error) {
				console.log(error);
				msg.react('❌');
			}
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

	if (reaction.message.id == "896450856298381312") {
		const role1 = "862237914863239198";
		const role2 = "680810288605298744";
		if (reaction.emoji.name == '✅') {
			member.roles.add(role1);
		}
		if (reaction.emoji.id == '712278814163730452') {
			member.roles.add(role2);
		}
	}

	if (reaction.message.id == "896450908928507965") {
		const role3 = "862237991635124244";
		const role4 = "781487757176209428";
		if (reaction.emoji.name == '✅') {
			member.roles.add(role3);
		}
		if (reaction.emoji.id == '781493087342952479') {
			member.roles.add(role4);
		}
	}

	if (reaction.message.id == "896450949474816100") {
		const role5 = "862238161395908628";
		if (reaction.emoji.name == '🏆') {
			member.roles.add(role5);
		}
	}

	if (reaction.message.id == "896450993531801672") {
		const role6 = "862238264752996372";
		if (reaction.emoji.name == '🧩') {
			member.roles.add(role6);
		}
	}
});

client.on("messageReactionRemove", (reaction, user) => {
	const member = reaction.message.guild.members.cache.get(user.id);
	if (reaction.message.id == "896450856298381312") {
		if (reaction.emoji.name == '✅') {
			member.roles.remove("862237914863239198");
		}
		if (reaction.emoji.id == '712278814163730452') {
			console.log("mscball reaction removed")
			member.roles.remove("680810288605298744");
		}
	}

	if (reaction.message.id == "896450908928507965") {
		if (reaction.emoji.name == '✅') {
			member.roles.remove("862237991635124244");
		}
		if (reaction.emoji.id == '781493087342952479') {
			console.log('sms ball reaction removed')
			member.roles.remove("781487757176209428");
		}
	}

	if (reaction.message.id == "896450949474816100") {
		if (reaction.emoji.name == '🏆') {
			member.roles.remove("862238161395908628");
		}
	}

	if (reaction.message.id == "896450993531801672") {
		if (reaction.emoji.name == '🧩') {
			member.roles.remove("862238264752996372");
		}
	}
})

client.login(process.env.BOT_TOKEN)
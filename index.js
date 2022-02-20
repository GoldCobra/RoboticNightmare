require('dotenv').config()
const axios = require('axios')

const { Client, Intents, Collection } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageActionRow, MessageButton} = require('discord.js')



const msc = 1;
const sms = 2;
let editMessageObj = {
	awaitingMessageID: false,
	awaitingChannelID: false,
	awaitingMessageText: false,
	currentAuth: '',
	originChannel: '',
	editMessageID: '',
	editChannelID: ''
}

const {smsCommands} = require('./commands/sms');
const {mscCommands} = require ('./commands/msc');
const {generalCommands, generalCommandButtonCallBacks} = require('./commands/commands')
const CONSTANTS = require('./constants');
const EMOJIS = require('./emoji');
const { config } = require('./sql_config');
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

// stadium listing
const stadiums = ['The Classroom', 'The Sand Tomb', 'The Palace', 'Thunder Island', 'Pipeline Central', 'Konga Coliseum', 'The Underground', 'The Wastelands',
	'Crater Field', 'The Dump', 'The Vice', 'Crystal Canyon', 'The Battle Dome', 'The Lava Pit', 'Galactic Stadium', 'Bowser Stadium', 'Stormship Stadium'];
const rules = ['Items Off', 'Bowser Attack On', 'Everything On', 'Normal Competitive Rules', 'First to 10 in Strikers 101', 'Infinite Items', 'Giant Items', 'No Toads', 'Create Your Own Rules', 'Superstrikes On'];

client.on('guildMemberAdd', (member) => {
	member.createDM()
		.then(DM => DM.send(`Welcome to the server <@${member.id}>. Be sure to checkout the rules <#${CONSTANTS.CHANNELS.RULE_CHANNEL}> and visit <#${CONSTANTS.CHANNELS.SERVER_ROLES_CHANNEL}> to gain access to more channels.`)
		.catch((err) => {
			errorHandler(err);
		}));
});

var fs = require('fs');

let sql = require('mssql');

let rando = 0;

// time in minutes that cronJob will run
const interval = 30;

client.commands = new Collection()



client.on('interactionCreate', async interaction => {
	console.log(smsCommands['rating'])

	if (!interaction.isCommand()) {
		if (interaction.componentType === 'BUTTON') {
			if (interaction.message.interaction) {
			if (interaction.message.interaction.commandName === 'sms') {
				return;
			} else if (interaction.message.interaction.commandName === 'msc') {
				return;
				} 
			}
		} 	
		return await generalCommandButtonCallBacks[interaction.customId](interaction);
	};

	if (interaction.commandName === 'sms') {
		try {
			console.log(smsCommands['rating'])
			return await smsCommands[interaction.options._subcommand](interaction);
		} catch (err) {
			console.log(err)
			return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	} else if (interaction.commandName === 'msc'){
		try {
			return await mscCommands[interaction.options._subcommand](interaction);
		} catch (err) {
			console.log(err)
			return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	} else {
		try{
			return await generalCommands[interaction.commandName](interaction);
		} catch (err) {
			console.log('but')
			console.log(err)
			return interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
		}
	}
});


client.on("ready", cronJob);

async function cronJob() {
	// set status to Playing at X, where X is a random stadium from MSC/SMS
	client.user.setActivity('at ' + stadiums[rando], { type: 'PLAYING' });
	rando = Math.floor(Math.random() * 17);

	// set All active players ranks as roles
	const guild = client.guilds.cache.get(CONSTANTS.GUILD_ID);
	let ratings = [];
	try {
		ratings = await getRankRolesPerUser();
	}
	catch (err) {
		console.log(err);
	}

	ratings.forEach(rating => {
		const playerRole = rating.RoleID;
		const playerID = rating.UserID;

		guild.members.fetch(playerID)
			.then((user) => {
				if (user) {
					try {
						user._roles.forEach(role => {
							if (CONSTANTS.PLAYER_ROLES.includes(role) && role != playerRole) {
								user.roles.remove(role)
							}
						});
						user.roles.add(playerRole);
					}
					catch (err) {
						console.log("User doesn't exist");
					}
				}
			})
	});
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

//Gets Ratings for Active Players
function getRatings(gametype) {
	return new Promise((resolve, reject) => {
		try {
			sql.connect(config, function (err) {
				var request = new sql.Request();

				let query = "exec GetRatingsForDiscord @gametype";
				request.input('gametype', gametype);

				request.query(query, function (err, recordset) {
					if (err) {
						console.log(err);
						errorHandler(err)
					}
					else {
						resolve(recordset.recordset);
					}

				})
			});
		} catch (error) {
			errorHandler(error)
		}
	})
}

function getRankRolesPerUser() {
	return new Promise((resolve, reject) => {
		try {
			sql.connect(config, function (err) {
				var request = new sql.Request();

				let query = "exec GetDiscordRankRolesByUserID";

				request.query(query, function (err, recordset) {
					if (err) {
						errorHandler(err)
						console.log(err);
					}
					else {
						resolve(recordset.recordset);
					}

				})
			});
		} catch (error) {
			errorHandler(error)
		}
	})
}

function reportScore(command, p1, p2, score, channel, tournament, stage) {
	let gametype = -1;

	return new Promise((resolve, reject) => {
		try {
			sql.connect(config, function (err) {
				var request = new sql.Request();

				let query = "exec reportScore @gametype, @p1, @p2, @score, null, '', '', 0, @c";
				
				if (command.startsWith("!msc")) {
					gametype = msc;
				}
				else if (command.startsWith("!sms")) {
					gametype = sms;
				}
				request.input("p1", p1);
				request.input("p2", p2);
				request.input("score", score);
				request.input("c", channel);

				if (command.startsWith("!prepare")) {
					// i have no idea what this does or why it works
					gametype = command.slice(-1);
					
					query = "exec reportScore @gametype, @p1, @p2, @score, null, @t, @s, 1, @c";
					request.input("t", tournament);
					request.input("s", stage);
				}

				request.input("gametype", gametype);

				request.query(query, function (err, recordset) {
					if (err) {
						errorHandler(err)
						console.log(err);
					}
					else {
						resolve(recordset.recordset);
					}

				})
			});
		} catch (error) {
			errorHandler(error)
		}
	})
}

client.on("messageCreate", messageManager);

async function messageManager(msg) {
	if (msg.author.bot) return
	if (true) {
		if (msg.channel.id) {
			var token = msg.content.split(" ");
			if (editMessageObj.currentAuth.length > 0) {
				if (editMessageObj.currentAuth == msg.author.id && msg.channel.id == editMessageObj.originChannel.id) {
					if (msg.content == "!closeedit") {
						editMessageObj = {
							awaitingMessageID: false,
							awaitingChannelID: false,
							awaitingMessageText: false,
							currentAuth: '',
							originChannel: '',
							editMessageID: '',
							editChannelID: ''
						}
						msg.channel.send('Editing session succesfully closed')
							.catch(err => {
								discordMessageErrorHandler(err, msg);
							})
					}
					else if (editMessageObj.awaitingChannelID) {
						msg.channel.send('Please enter message ID')
							.catch((err) => {
								discordMessageErrorHandler(err, msg);
							});
						editMessageObj.awaitingChannelID = false;
						editMessageObj.awaitingMessageID = true;
						editMessageObj.editChannelID = msg.content;
					}
					else if (editMessageObj.awaitingMessageID) {
						msg.channel.send('Please enter new message text')
							.catch((err) => {
								discordMessageErrorHandler(err, msg);
							});
						editMessageObj.awaitingMessageID = false;
						editMessageObj.awaitingMessageText = true;
						editMessageObj.editMessageID = msg.content
					} else if (editMessageObj.awaitingMessageText) {
						editMessageObj.awaitingMessageText = false;
						editMessageObj.currentAuth = '';
						msg.guild.channels.fetch(editMessageObj.editChannelID)
							.then(channel => {
								channel.messages.fetch(editMessageObj.editMessageID)
									.then(message => {
										message.edit(msg.content);
									});
							});
					}
				}
			}

			else if (token[0] == "!roboedit") {
				if (editMessageObj.currentAuth.length > 0) {
					msg.channel.send('Another user has an editing session open, to close use the command *!closeedit*')
						.catch((err) => {
							discordMessageErrorHandler(err, msg)
						})
				} else {
					msg.channel.send('Please enter channel ID');
					editMessageObj.awaitingChannelID = true
					editMessageObj.currentAuth = msg.author.id
					editMessageObj.originChannel = msg.channel
				}
			}
			else if (token[0] == "!closeedit") {
				if (editMessageObj.currentAuth.length > 0) {
					editMessageObj.originChannel.send(`<@${msg.author.id}> has closed an editing session started by <@${editMessageObj.currentAuth}> in this channel.`)
						.catch(err => {
							discordMessageErrorHandler(err, msg);
						})
					editMessageObj = {
						awaitingMessageID: false,
						awaitingChannelID: false,
						awaitingMessageText: false,
						currentAuth: '',
						originChannel: '',
						editMessageID: '',
						editChannelID: ''
					}
					msg.channel.send('Session succesfully closed')
						.catch(err => {
							discordMessageErrorHandler(err, msg);
						});
				} else {
					msg.channel.send('There are no open editing sessions. You can start one using *!roboedit*')
						.catch(err => {
							discordMessageErrorHandler(err, msg)
						})
				}
			}
			else if (token[0] == "!piedwishes") {
				msg.channel.send("Pied wishes he was as good as me")
					.catch(err => {
						discordMessageErrorHandler(err, msg);
					});
			}
			else if (token[0] == "!help" || token[0] == "!setup") {
				msg.channel.send("Btw, I recomend only having this .iso in your paths so Dolphin doesn’t get confused during netplay.")
					.catch(err => {
						discordMessageErrorHandler(err,msg);
					})
			}
			else if (token[0] == "!robosend") {
				fs.readFile('msg_send.txt', 'utf8', function (err, data) {
					if (err) throw err;
					client.channels.cache.get('902508170126180352').send(data)
						.catch((err) => {
							discordMessageErrorHandler(err, msg)

						});
				});
			}

			else if (token[0] == "!sandbox") {
				fs.readFile('sandbox_msc.txt', 'utf8', function (err, data) {
					if (err) throw err;
					client.channels.cache.get('897757084299431936').send(data)
						.catch((err) => {
							discordMessageErrorHandler(err, msg)

						});
				});
				fs.readFile('sandbox_sms.txt', 'utf8', function (err, data) {
					if (err) throw err;
					client.channels.cache.get('897757084299431936').send(data)
						.catch((err) => {
							discordMessageErrorHandler(err, msg)

						});
				});
			}

			else if (token[0] == "!msciso") {
				if (msg.bot)
					return;

				msg.author.send("Below is a link to the Wiimmfi-Patched MSC PAL ISO. Please do not share this link with anyone else!\n\nhttp://e.pc.cd/oB1otalK")
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});

				msg.delete();
			}

			else if (token[0] == "!smsiso") {
				if (msg.bot)
					return;

				msg.author.send("Below is a link to Super Mario Strikers NTSC ISO. Please do not share this link with anyone else!\n\nhttp://e.pc.cd/sB1otalK")
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});

				msg.delete();
			}

			else if (token[0] == "!rechargediso" || token[0] == "!trainingiso") {
				if (msg.bot)
					return;

				msg.author.send("Below is a link to Mario Strikers Training Mode, which has improved Strikers ABC scenarios and allows for fast tournement play on most fields.\n\nhttps://drive.google.com/file/d/1ip-V4xFpf9-BJEMOaZw1hZw1nPVXXU88")
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});

				msg.delete();
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
							if (err) {
								console.log(err)
								errorHandler(err, msg);
							}
						});
					})

					msg.react('☑️');
				}

				catch (error) {
					console.log(error);
					msg.react('❌');
					errorHandler(error, msg)
				}
			}

			// function removes one-off commands
			else if (token[0] == "!removecommand") {
				try {
					sql.connect(config, function (err) {
						var request = new sql.Request();

						let query = "delete from discordCommands where token = @token";

						request.input("token", "!" + token[1]);

						request.query(query, function (err, recordset) {
							if (err) {
								console.log(err)
								errorHandler(err, msg)
							}
						});
					})

					msg.react('☑️');
				}

				catch (error) {
					console.log(error);
					msg.react('❌');
					errorHandler(error, msg)
				}
			}
			
			// function removes one-off commands
			else if (token[0] == "!cancelmatch") {
				try {
					sql.connect(config, function (err) {
						var request = new sql.Request();

						let query = "exec cancelMatch @mid";

						request.input("mid", token[1]);

						request.query(query, function (err, recordset) {
							if (err) {
								console.log(err)
								errorHandler(err, msg)
							}
						});
					})

					msg.react('☑️');
				}

				catch (error) {
					console.log(error);
					msg.react('❌');
					errorHandler(error, msg)
				}
			}

			else if (token[0] == "!mscallcomp") {
				p1LastSK = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)]
				p2LastSK = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)]

				mscCaptains = CONSTANTS.MSC_CAPTAINS[Math.floor(Math.random() * CONSTANTS.MSC_CAPTAINS.length)]
				p1Captain = CONSTANTS.MSC_CAPTAINS[Math.floor(Math.random() * CONSTANTS.MSC_CAPTAINS.length)]
				remainingCaptains = CONSTANTS.MSC_CAPTAINS.filter(captain => captain !== p1Captain)
				p2Captain = remainingCaptains[Math.floor(Math.random() * remainingCaptains.length)]

				randStadium = CONSTANTS.MSC_COMP_STADIUMS[Math.floor(Math.random() * CONSTANTS.MSC_COMP_STADIUMS.length)]

				msg.channel.send(`>>> ${EMOJIS[p1Captain]} ${EMOJIS.mscboo} ${EMOJIS.mscboo} ${EMOJIS[p1LastSK]}   **VS**   ${EMOJIS[p2Captain]} ${EMOJIS.mscboo} ${EMOJIS.mscboo} ${EMOJIS[p2LastSK]}\n:stadium: **${randStadium}**\n:1234: **Best of 3**\n:goal: **First to 10**`)
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});
			}

			else if (token[0] == "!smsallcomp") {
				p1Captain = CONSTANTS.SMS_CAPTAIN[Math.floor(Math.random() * CONSTANTS.SMS_CAPTAIN.length)]
				remainingCaptains = CONSTANTS.SMS_CAPTAIN.filter(captain => captain !== p1Captain)
				p2Captain = remainingCaptains[Math.floor(Math.random() * remainingCaptains.length)]

				randStadium = CONSTANTS.SMS_COMP_STADIUMS[Math.floor(Math.random() * CONSTANTS.SMS_COMP_STADIUMS.length)]

				msg.channel.send(`>>> ${EMOJIS[p1Captain]} ${EMOJIS.smstoad}   **VS**   ${EMOJIS[p2Captain]} ${EMOJIS.smstoad}\n:stadium: **${randStadium}**\n:1234: **Best of 5**\n:alarm_clock: **5 Minutes**\n${EMOJIS.megastrike} **Super Strikes Off**`)
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});
			}

			else if (token[0] == "!smsallrandom") {
				p1Captain = CONSTANTS.SMS_CAPTAIN[Math.floor(Math.random() * CONSTANTS.SMS_CAPTAIN.length)]
				remainingCaptains = CONSTANTS.SMS_CAPTAIN.filter(captain => captain !== p1Captain)
				p2Captain = remainingCaptains[Math.floor(Math.random() * remainingCaptains.length)]

				p1SK = CONSTANTS.SMS_SK[Math.floor(Math.random() * CONSTANTS.SMS_SK.length)];
				p2SK = CONSTANTS.SMS_SK[Math.floor(Math.random() * CONSTANTS.SMS_SK.length)];

				maxSeries = 9;
				minSeries = 1;
				seriesAmount = Math.floor(Math.random() * (maxSeries - minSeries));
				seriesAmount = seriesAmount % 2 != 0 ? seriesAmount += 1 : seriesAmount;
				seriesAmount += minSeries;


				randStadium = CONSTANTS.SMS_ALL_STADIUMS[Math.floor(Math.random() * CONSTANTS.SMS_ALL_STADIUMS.length)]

				times = [2, 3, 4, 5]
				randTime = times[Math.floor(Math.random() * times.length)]

				superStrikes = Math.floor(Math.random() + .5) ? "On" : "Off"

				msg.channel.send(`>>> ${EMOJIS[p1Captain]} ${EMOJIS[p1SK]}   **VS**   ${EMOJIS[p2Captain]} ${EMOJIS[p2SK]}\n:stadium: **${randStadium}**\n:1234: **Best of ${seriesAmount}**\n:alarm_clock: **${randTime} Minutes**\n${EMOJIS.megastrike} **Super Strikes ${superStrikes}**`)
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					})
			}

			else if (token[0] == "!smsct" || token[0] == "!smscompteam") {
				p1Captain = CONSTANTS.SMS_CAPTAIN[Math.floor(Math.random() * CONSTANTS.SMS_CAPTAIN.length)]

				msg.channel.send(`>>> ${EMOJIS[p1Captain]} ${EMOJIS.smstoad}`)
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});
			}

			else if (token[0] == "!smsrt" || token[0] == "!smsrandomteam") {
				p1Captain = CONSTANTS.SMS_CAPTAIN[Math.floor(Math.random() * CONSTANTS.SMS_CAPTAIN.length)]
				p1SK = CONSTANTS.SMS_SK[Math.floor(Math.random() * CONSTANTS.SMS_SK.length)];
				msg.channel.send(`>>> ${EMOJIS[p1Captain]} ${EMOJIS[p1SK]}`)
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});

			}

			else if (token[0] == "!mscallrandom") {

				p1SK1 = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)];
				p2SK1 = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)];
				p1SK2 = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)];
				p2SK2 = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)];
				p1SK3 = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)];
				p2SK3 = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)];

				p1Captain = CONSTANTS.MSC_CAPTAINS[Math.floor(Math.random() * CONSTANTS.MSC_CAPTAINS.length)];
				remainingCaptains = CONSTANTS.MSC_CAPTAINS.filter(captain => captain !== p1Captain)
				p2Captain = remainingCaptains[Math.floor(Math.random() * remainingCaptains.length)]

				randStadium = CONSTANTS.MSC_ALL_STADIUMS[Math.floor(Math.random() * CONSTANTS.MSC_ALL_STADIUMS.length)]

				maxSeries = 9;
				minSeries = 1;
				seriesAmount = Math.floor(Math.random() * (maxSeries - minSeries));
				seriesAmount = seriesAmount % 2 != 0 ? seriesAmount += 1 : seriesAmount;
				seriesAmount += minSeries;

				minGoals = 3;
				maxGoals = 10;
				goalAmount = Math.floor(Math.random() * (maxSeries - minSeries)) + minSeries;

				msg.channel.send(`>>> ${EMOJIS[p1Captain]} ${EMOJIS[p1SK1]} ${EMOJIS[p1SK2]} ${EMOJIS[p1SK3]}   **VS**   ${EMOJIS[p2Captain]} ${EMOJIS[p2SK1]} ${EMOJIS[p2SK2]} ${EMOJIS[p2SK3]}\n:stadium: **${randStadium}**\n:1234: **Best of ${seriesAmount}**\n:goal: **First to ${goalAmount}**`)
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});
			}

			else if (token[0] == "!mscclassic" || token[0] == "!smsrs" || token[0] == "!smsrandomstage") {
				msg.channel.send(`>>> **${CONSTANTS.SMS_ALL_STADIUMS[Math.floor(Math.random() * CONSTANTS.SMS_ALL_STADIUMS.length)]}**`)
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});
			}

			else if (token[0] == "!msccs" || token[0] == "!msccompstage") {
				msg.channel.send(`>>> **${CONSTANTS.MSC_COMP_STADIUMS[Math.floor(Math.random() * CONSTANTS.MSC_COMP_STADIUMS.length)]}**`)
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});
			}

			else if (token[0] == "!mscrs" || token[0] == "!mscrandomstage") {
				msg.channel.send(`>>> **${CONSTANTS.MSC_ALL_STADIUMS[Math.floor(Math.random() * CONSTANTS.MSC_ALL_STADIUMS.length)]}**`)
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});
			}

			else if (token[0] == "!mscct" || token[0] == "!msccompteam") {
				p1LastSK = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)]
				p1Captain = CONSTANTS.MSC_CAPTAINS[Math.floor(Math.random() * CONSTANTS.MSC_CAPTAINS.length)];

				msg.channel.send(`>>> ${EMOJIS[p1Captain]} ${EMOJIS.mscboo} ${EMOJIS.mscboo} ${EMOJIS[p1LastSK]}`)
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});

			}

			else if (token[0] == "!mscrt" || token[0] == "!mscrandomteam") {

				p1SK1 = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)];
				p1SK2 = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)];
				p1SK3 = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)];

				p1Captain = CONSTANTS.MSC_CAPTAINS[Math.floor(Math.random() * CONSTANTS.MSC_CAPTAINS.length)];

				msg.channel.send(`>>> ${EMOJIS[p1Captain]} ${EMOJIS[p1SK1]} ${EMOJIS[p1SK2]} ${EMOJIS[p1SK3]}`)
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});
			}

			else if (token[0] == "!mscdbt" || token[0] == "!mscdrybonesteam") {

				p1Captain = CONSTANTS.MSC_CAPTAINS[Math.floor(Math.random() * CONSTANTS.MSC_CAPTAINS.length)];
				p1SK3 = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)];


				msg.channel.send(`>>> ${EMOJIS[p1Captain]} ${EMOJIS.mscboo} ${EMOJIS.mscdrybones} ${EMOJIS[p1SK3]}`)
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});
			}

			// function displays the tier list for MSC
			else if (token[0] == "!flip") {
				if (msg.bot) return;

				let x = Math.random();

				if (x >= .5)
					msg.reply("heads!");
				else
					msg.reply("tails!");
			}

			else if (token[0] === "!button") {
				roleValidate = await roleValidator(client,msg.author.id,[CONSTANTS.ROLES.ADMIN,CONSTANTS.ROLES.DEVELOPER,CONSTANTS.ROLES.SERVER_STAFF]);

				if (roleValidate) {
				
				const row1 = [new MessageActionRow()
					.addComponents([
						new MessageButton()
						.setCustomId('msbl')
						.setLabel('Mario Strikers: Battle League')
						.setEmoji('944220435401277451')
						.setStyle('SECONDARY'),
						new MessageButton()
						.setCustomId('msc')
						.setLabel('Mario Strikers Charged')
						.setStyle('PRIMARY'),
						new MessageButton()
						.setCustomId('sms')
						.setLabel('Super Mario Strikers')
						.setStyle('PRIMARY'),
						new MessageButton()
						.setCustomId('tournaments')
						.setLabel('Tournaments')
						.setStyle('PRIMARY'),
						new MessageButton()
						.setCustomId('modding')
						.setLabel('Modding')
						.setStyle('PRIMARY')
					])
				]
				const row2 = [
					new MessageActionRow()
					.addComponents([
						new MessageButton()
						.setCustomId('msbllfg')
						.setLabel('MSBL LFG')
						.setStyle('PRIMARY'),
						new MessageButton()
						.setCustomId('msclfg')
						.setLabel('MSC LFG')
						.setStyle('PRIMARY'),
						new MessageButton()
						.setCustomId('mscdolphinlfg')
						.setLabel('MSC Dolphin LFG')
						.setStyle('PRIMARY'),
						new MessageButton()
						.setCustomId('smslfg')
						.setLabel('SMS LFG')
						.setStyle('PRIMARY')
					])
				]
				const row3 =[
					new MessageActionRow()
					.addComponents([
						new MessageButton()
						.setCustomId('msl')
						.setLabel('MSL Announcements')
						.setStyle('PRIMARY'),
						new MessageButton()
						.setCustomId('msblspectator')
						.setLabel('MSBL Spectator')
						.setStyle('PRIMARY'),
						new MessageButton()
						.setCustomId('mscspectator')
						.setLabel('MSC Spectator')
						.setStyle('PRIMARY'),
						new MessageButton()
						.setCustomId('smsspectator')
						.setLabel('SMS Spectator')
						.setStyle('PRIMARY')
					])
				]
					msg.channel.send({content: `**If you wish to access more areas of the server, push the dedicated buttons below.**`, components:row1})
					msg.channel.send({content:'**If you are looking for games and would like to notify/be notified for searching for opponents, select your specific game(s)**', components:row2})
					msg.channel.send({content: `**Would you like to receive any of these notifications or announcements?**`, components: row3});
				} else {
					msg.channel.send(`Sorry you do not have the correct permissions for this command`);
				}
			}
			// function displays the tier list for MSC
			else if (token[0] == "!msctl") {
				if (msg.bot) return;

				msg.channel.send("https://media.discordapp.net/attachments/806813942218883073/869189371847381022/unknown.png")
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});
				msg.channel.send("https://media.discordapp.net/attachments/806813942218883073/869189471533400074/unknown.png")
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});
			}

			else if (token[0] == "!smstl") {
				if (msg.bot) return;

				msg.channel.send("https://media.discordapp.net/attachments/790895921989812254/912453085253763072/TierList_SMS_Captain_3.png")
					.catch((err) => {
						discordMessageErrorHandler(err, msg)
					});
				msg.channel.send("https://media.discordapp.net/attachments/790895921989812254/912453085622833212/TierList_SMS_Sidekick_2.png")
					.catch((err) => {
						discordMessageErrorHandler(err, msg)
					});
			}

			// function shows the ratings of all active players for MSC
			else if (token[0] == "!mscrating") {
				try {
					data = await getRatings(msc)
					const chunkSize = 20;
					const chunkHolder = []
					const numChunks = Math.floor(data.length / chunkSize);
					for (let i = 0; i < numChunks; i++) {
						chunk = data.slice(i * chunkSize, i + 1 * chunkSize);
						chunkHolder.push(chunk.map(x => x.line));
					}
					if (data.length % chunkSize !== 0) {
						chunk = data.slice(numChunks * chunkSize, data.length);
						chunkHolder.push(chunk.map(x => x.line));
					}
					chunkHolder.forEach((chunk) => {
						msg.channel.send(chunk.join('\n'))
							.catch((err) => {
								discordMessageErrorHandler(err, msg)
							});
					});
				} catch (err) {
					errorHandler(err, msg)
				}
			}

			// function shows the ratings of all active players for SMS
			else if (token[0] == "!smsrating") {
				try {
					const data = await getRatings(sms)
					const chunkSize = 20;
					const chunkHolder = []
					const numChunks = Math.floor(data.length / chunkSize);
					for (let i = 0; i < numChunks; i++) {
						chunk = data.slice(i * chunkSize, i + 1 * chunkSize);
						chunkHolder.push(chunk.map(x => x.line));
					}
					if (data.length % chunkSize !== 0) {
						chunk = data.slice(numChunks * chunkSize, data.length);
						chunkHolder.push(chunk.map(x => x.line));
					}
					chunkHolder.forEach((chunk) => {
						msg.channel.send(chunk.join('\n'))
							.catch((err) => {
								discordMessageErrorHandler(err, msg)
							});
					});
				} catch (err) {
					errorHandler(err, msg)
				}
			}

			// function shows the current MSL Rankings for MSC
			else if (token[0] == "!mslmsc") {
				const url3 = "https://docs.google.com/spreadsheets/d/1Cf5YggxcwNVMCTyQ1Xz7wC7OaOxVoC1rQIeEJSXo6s8/gviz/tq?";

				if (msg.bot) return;
				msg.channel.send("**MSL Season 1** — MSC Rankings")
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});;
				axios.get(url3)
					.then(function (response) {
						const data = JSON.parse(response.data.substr(47).slice(0, -2));
						const newData3 = [];

						data.table.rows.map((main) => {
							newData3.push(main.c[0].v);
						})
						msg.channel.send(newData3.join('\n'))
							.catch((err) => {
								discordMessageErrorHandler(err, msg)

							});
						// I need this data here ^^
						return response.data;
					})
					.catch(function (error) {
						console.log(error);
						errorHandler(error, msg)
					});
			}

			// function shows the current MSL Rankings for SMS
			else if (token[0] == "!mslsms") {
				const url4 = "https://docs.google.com/spreadsheets/d/1elh4wTVHNR0dv-QNklaNLMUNU07VKuaFkZkU9G2XWQ0/gviz/tq?";

				if (msg.bot) return;
				msg.channel.send("**MSL Season 1** — SMS Rankings")
					.catch((err) => {
						discordMessageErrorHandler(err, msg)

					});;
				axios.get(url4)
					.then(function (response) {
						const data = JSON.parse(response.data.substr(47).slice(0, -2));
						const newData4 = [];

						data.table.rows.map((main) => {
							newData4.push(main.c[0].v);
						})
						msg.channel.send(newData4.join('\n'))
							.catch((err) => {
								discordMessageErrorHandler(err, msg)

							});
						// I need this data here ^^
						return response.data;
					})
					.catch(function (error) {
						console.log(error);
						errorHandler(error, msg)
					});
			}

			// function allows the user to report the score for a tournament (or ranked, eventually) match
			else if (token[0] == "!mscreport" || token[0] == "!smsreport") {
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
					try {
						await reportScore(token[0], p1, p2, score, msg.channel.name);
						msg.react("☑️");
					}
					catch (err) {
						msg.react("❌")
					}
				}
				catch (error) {
					console.log(error);
					msg.react('❌');
					errorHandler(error, msg);
				}
			}

			else if (token[0] == "!preparematch") {
				if (msg.bot) return;
				try {
					// get the score and the discord ids if available
					let p1 = client.users.cache.get(token[2].replace("<", "").replace(">", "").replace("@", "").replace("!", ""));

					let p2 = client.users.cache.get(token[3].replace("<", "").replace(">", "").replace("@", "").replace("!", ""));

					// set the paramters - if the token isn't a discord tag, just get the text, otherwise get the id and username
					if (p1 == undefined)
						p1 = token[2];
					else
						p1 = token[2] + p1.username;

					if (p2 == undefined)
						p2 = token[3];
					else
						p2 = token[3] + p2.username;

					let gametype = token[1];
					let tournament = token[4];
					let stage = token[5];
					let score = "0-0";

					try {
						await reportScore(token[0] + String(gametype), p1, p2, score, msg.channel.name, tournament, stage);
						msg.react("☑️");
					}
					catch (err) {
						console.log(err);
						msg.react("❌")
						errorHandler(err, msg)
					}
				}
				catch (error) {
					console.log(error);
					msg.react('❌');
					errorHandler(error, msg)
				}
			}

			else if (token[0] == "!randomrule") {
				if (msg.bot) return;
				msg.channel.send(rules[Math.floor(Math.random() * rules.length)]);
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
								msg.react('❌');
								errorHandler(err, msg);
							}
							else {
								let data = recordset.recordset;
								if (recordset.recordset.length == 0) {
									if (!CONSTANTS.EXTERNAL_BOT_COMMANDS.includes(token[0])) {
										msg.channel.send(`>>> Oops, I couldn't find the command you were looking for! Head over to <#${CONSTANTS.CHANNELS.COMMAND_SANDBOX_CHANNEL}> and use *!sandbox* to see all my commands. If you have an idea for a new command use *!issuetracker* to suggest one.`)
											.catch((err) => {
												discordMessageErrorHandler(err, msg);
											});
									}
								}
								else {
									msg.channel.send(recordset.recordset[0].Response)
										.catch((err) => {
											discordMessageErrorHandler(err, msg)

										});
								}
							}
						})
					})
				}
				catch (error) {
					console.log(error);
					msg.react('❌');
					errorHandler(error, msg)
				}
			}
		}
	}
	
}

const discordMessageErrorHandler = (err, msg) => {
	try {
		channelId = err.path.split('/')[2];
		client.channels.fetch(channelId).then(channel => {
			errorHandler(err, msg, channel.name)
		});
	} catch {
		errorHandler(err, msg, 'unable to retrieve channel');
	}
}

const errorHandler = (err, msg=false, location = "internal") => {
	if (msg) {
	msg.channel.send(`>>> Sorry, we got lost completing your request ${EMOJIS.mscwariodizzy}\n\nSupport for this bot can be reached through pinging *@Developer*`);
	} else {
		msg = {content: 'Internal Command'}
	}

	client.channels.cache.get(CONSTANTS.CHANNELS.DEBUG_CHANNEL)
		.send(`----------\nError Message: ${err.message}\nCommand: ${msg.content}\nDate: ${new Date().toISOString()}\nLocation: ${location}\n\nStack Trace: ${err.stack}`)
		.catch((err) => {
			console.log(err)
		});
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
		const dolphin = "890249419495211068";
		if (reaction.emoji.name == '✅') {
			member.roles.add(role1);
		}
		if (reaction.emoji.id == '712278814163730452') {
			member.roles.add(role2);
		}
		if (reaction.emoji.id == '890249419495211068') {
			console.log('I found a dolphin one!');
			member.roles.add('915981506898460742');
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
		if (reaction.emoji.id == '890249419495211068') {
			member.roles.remove('915981506898460742')
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

const { SlashCommandBuilder } = require('@discordjs/builders')
const sql = require('mssql')
const { config } = require('../sql_config');
const axios = require('axios')
const CONSTANTS = require('../constants');
const EMOJIS = require('../emoji');
const rules = ['Items Off', 'Bowser Attack On', 'Everything On', 'Normal Competitive Rules', 'First to 10 in Strikers 101', 'Infinite Items', 'Giant Items', 'No Toads', 'Create Your Own Rules', 'Superstrikes On']


smsRegisterCommands = [new SlashCommandBuilder()
		.setName('sms')
		.setDescription('SMS Commands')
		.addSubcommand(subcommand => 
			subcommand
			.setName('rating')
			.setDescription('Current Ratings for All Competitive SMS Players'))
		.addSubcommand(subcommand =>
			subcommand
			.setName('msl')
			.setDescription('SMS MSL Rankings'))
		.addSubcommand(subcommand =>
			subcommand
			.setName('report')
			.setDescription('Reporting SMS Matches')
			.addUserOption(option => option.setName('p1').setDescription('Player 1'))
			.addUserOption(option => option.setName('p2').setDescription('Player 2'))
			.addStringOption(option => option.setName('score').setDescription('Score')))
		.addSubcommand(subcommand =>
			subcommand
			.setName('randomrule')
			.setDescription('Generate a random rule for SMS matches'))
		.addSubcommand(subcommand =>
			subcommand
			.setName('allcomp')
			.setDescription('A randomly generated **competitive** SMS ruleset'))
		.addSubcommand(subcommand =>
			subcommand
			.setName('allrandom')
			.setDescription('A completely randomly generated SMS ruleset'))
		.addSubcommand(subcommand =>
			subcommand
			.setName('compteam')
			.setDescription('A randomly generated **competitive** team for SMS'))
		.addSubcommand(subcommand =>
			subcommand
			.setName('randomteam')
			.setDescription('A completely random SMS team'))
		.addSubcommand(subcommand =>
			subcommand
			.setName('randomstage')
			.setDescription('A random SMS stage'))
		]
		
		
		


smsCommands = {
	'smsrating': async (interaction) => {
		try {
			sql.connect(config, (err) => {
				const request = new sql.Request();
				const query = 'exec GetRatingsForDiscord @gametype';
				request.input('gametype', sms);
				request.query(query, (err, recordset) => {
					if (err) {
						console.log(err);
						interaction.reply('❌')
					} else {
						let smsRatings = ''
						recordset.recordset.forEach((record) => {
							smsRatings += `${record.line}\n`
						})
						interaction.reply(smsRatings)
					}
				});
			});
		} catch (error) {
			console.log(error);
			interaction.reply('❌')
		}
	},
	'mslsms': async (interaction) => {
		const url4 = "https://docs.google.com/spreadsheets/d/1elh4wTVHNR0dv-QNklaNLMUNU07VKuaFkZkU9G2XWQ0/gviz/tq?";

			if (msg.bot) return;
			msg.channel.send("**MSL Season 1** — SMS Rankings")
				.catch((err) => {
					console.log(err)
				});;
			axios.get(url4)
				.then(function (response) {
					const data = JSON.parse(response.data.substr(47).slice(0, -2));
					const newData4 = [];

					data.table.rows.map((main) => {
						newData4.push(main.c[0].v);
					})
					interaction.reply(newData4.join('\n'))
						.catch((err) => {
							console.log(err)

						});
					// I need this data here ^^
					return response.data;
				})
				.catch(function (error) {
					console.log(error);
				});
	},
	'smsreport': async(interaction) => {
		try {
			const p1 = interaction.options.getUser('p1').username;
			const p2 = interaction.options.getUser('p2').username;
			sql.connect(config, (err) => {
				const request = new sql.Request();
				const query = "exec reportScoreSMS @gametype, @p1, @p2, @score;"
				request.input("gametype", sms);
				request.input("p1", p1);
				request.input("p2", p2);
				request.input("score", interaction.options.getString('score'));
				request.query(query, (err, recordset) => {
					if (err) console.log(err)
				})
			})
			interaction.reply('☑️')
		} catch (error) {
			console.log(error)
			interaction.reply('❌')
		}
	},
	'randomrule': async(interaction) => {
		interaction.reply(rules[Math.floor(Math.random() * rules.length)]);
	},
	'smsallcomp': async(interaction) => {
		p1Captain = CONSTANTS.SMS_CAPTAIN[Math.floor(Math.random() * CONSTANTS.SMS_CAPTAIN.length)]
		remainingCaptains = CONSTANTS.SMS_CAPTAIN.filter(captain => captain !== p1Captain)
		p2Captain = remainingCaptains[Math.floor(Math.random() * remainingCaptains.length)]

		randStadium = CONSTANTS.SMS_COMP_STADIUMS[Math.floor(Math.random() * CONSTANTS.SMS_COMP_STADIUMS.length)]

		interaction.reply(`>>> ${EMOJIS[p1Captain]} ${EMOJIS.smstoad}   **VS**   ${EMOJIS[p2Captain]} ${EMOJIS.smstoad}\n:stadium: **${randStadium}**\n:1234: **Best of 5**\n:alarm_clock: **5 Minutes**\n${EMOJIS.megastrike} **Super Strikes Off**`)
			.catch((err) => {
				console.log(err)
			});
	},
	'smsallrandom': async(interaction) => {
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

		interaction.reply(`>>> ${EMOJIS[p1Captain]} ${EMOJIS[p1SK]}   **VS**   ${EMOJIS[p2Captain]} ${EMOJIS[p2SK]}\n:stadium: **${randStadium}**\n:1234: **Best of ${seriesAmount}**\n:alarm_clock: **${randTime} Minutes**\n${EMOJIS.megastrike} **Super Strikes ${superStrikes}**`)
			.catch((err) => {
				console.log(err)

			})
	},
	'smscompteam': async(interaction) => {
		p1Captain = CONSTANTS.SMS_CAPTAIN[Math.floor(Math.random() * CONSTANTS.SMS_CAPTAIN.length)]

		interaction.reply(`>>> ${EMOJIS[p1Captain]} ${EMOJIS.smstoad}`)
			.catch((err) => {
				console.log(err)

			});
	},
	'smsrandomteam': async(interaction) => {
		p1Captain = CONSTANTS.SMS_CAPTAIN[Math.floor(Math.random() * CONSTANTS.SMS_CAPTAIN.length)]
				p1SK = CONSTANTS.SMS_SK[Math.floor(Math.random() * CONSTANTS.SMS_SK.length)];
				interaction.reply(`>>> ${EMOJIS[p1Captain]} ${EMOJIS[p1SK]}`)
					.catch((err) => {
						console.log(err)

					});
	},
	'smsrandomstage': async(interaction) => {
		interaction.reply(`>>> **${CONSTANTS.SMS_ALL_STADIUMS[Math.floor(Math.random() * CONSTANTS.SMS_ALL_STADIUMS.length)]}**`)
		.catch((err) => {
			console.log(err)

		});
	}

}	

module.exports = { smsCommands, smsRegisterCommands }

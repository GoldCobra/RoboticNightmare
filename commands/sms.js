const { SlashCommandBuilder } = require('@discordjs/builders')
const sql = require('mssql')
const { config } = require('../sql_config');
const axios = require('axios')
const sms = 2; // because SMS is shit! :P
const rules = ['Items Off', 'Bowser Attack On', 'Everything On', 'Normal Competitive Rules', 'First to 10 in Strikers 101', 'Infinite Items', 'Giant Items', 'No Toads', 'Create Your Own Rules', 'Superstrikes On']
const commands = [
	{
		data: new SlashCommandBuilder()
			.setName('smsrating')
			.setDescription('Current Ratings for All Competitive SMS Players'),

		async execute(interaction) {
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
		}
	},
	{
		data: new SlashCommandBuilder()
			.setName('mslsms')
			.setDescription('SMS MSL Rankings'),

		async execute(interaction) {
			const url4 = "https://docs.google.com/spreadsheets/d/1elh4wTVHNR0dv-QNklaNLMUNU07VKuaFkZkU9G2XWQ0/gviz/tq?";

			interaction.reply("**MSL Season 1** — SMS Rankings");
			axios.get(url4)
				.then(function (response) {
					const data = JSON.parse(response.data.substr(47).slice(0, -2));
					const newData4 = [];

					data.table.rows.map((main) => {
						newData4.push(main.c[0].v);
					})
					interaction.followUp(newData4.join('\n'));
					// I need this data here ^^
					return response.data;
				})
				.catch(function (error) {
					console.log(error);
				});
		}
	},
	{
		data: new SlashCommandBuilder()
			.setName('smsreport')
			.setDescription('Reporting SMS Matches')
			.addUserOption(option => option.setName('p1').setDescription('Player 1'))
			.addUserOption(option => option.setName('p2').setDescription('Player 2'))
			.addStringOption(option => option.setName('score').setDescription('Score'))
			.setDefaultPermission(false),

		async execute(interaction) {
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
		}
	},
	{
		data: new SlashCommandBuilder()
			.setName('randomrule')
			.setDescription('Generate a random rule for SMS matches')
			.setDefaultPermission(true),

		async execute(interaction) {
			interaction.reply(rules[Math.floor(Math.random() * rules.length)]);
		}
	}
]

module.exports = { commands }

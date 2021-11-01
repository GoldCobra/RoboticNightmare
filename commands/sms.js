const {SlashCommandBuilder} = require('@discordjs/builders')
const sql = require('mssql')
const {config} = require('../sql_config');
const commands = [
    {
        data: new SlashCommandBuilder()
        .setName('smsrating')
        .setDescription('Current Ratings for All Competitive SMS Players'),

        async execute(interaction) {
            try {
                sql.connect(config,(err) => {
                    const request = new sql.Request();
                    const query = 'exec GetRatingsForDiscordSMS';
                    request.query(query, (err, recordset) => {
                        if (err) {
                            console.log(err);
                            interaction.reply('❌')
                        } else {
                            let smsRatings = ''
                            recordset.recordset.forEach((record) => {
                                smsRatings +=`${record.line}\n`
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
			
			if(msg.bot) return;
            interaction.reply("**MSL Season 1** — SMS Rankings");
			axios.get(url4)
			.then(function (response) {
				const data = JSON.parse(response.data.substr(47).slice(0,-2));
				const newData4 = [];

				data.table.rows.map((main)=>{
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
        .addIntegerOption(option => option.setName('score').setDescription('Score'))
        .setDefaultPermission(false),

        async execute(interaction) {
            try {
               const p1 = interaction.getUser('p1').username;
               const p2 = interaction.getUser('p2').username;
               sql.connect(config, (err) => {
                    const request = new sql.Request();
                    const query = "exec reportScoreSMS @p1, @p2, @score;"
                    request.input("p1", p1);
                    request.input("p2", p2);
                    request.input("score", score);
                    request.query(query, (err,recordset) => {
                       if (err) console.log(err)
                    })
                })
            interaction.reply('☑️') 
            } catch(error) {
                console.log(error)
                interaction.reply('❌')
            }
        }
    }
]

module.exports = {commands}
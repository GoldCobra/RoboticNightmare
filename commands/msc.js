const {SlashCommandBuilder} = require('@discordjs/builders')
const sql = require('mssql')
const {config} = require('../sql_config');
const axios = require('axios')

const commands = [
    {
        data: new SlashCommandBuilder()
        .setName('tlmsc')
        .setDescription('MSC Character Tier Rankings'),

        async execute(interaction) {
            interaction.reply("https://media.discordapp.net/attachments/806813942218883073/869189371847381022/unknown.png");
            interaction.followUp("https://media.discordapp.net/attachments/806813942218883073/869189471533400074/unknown.png");
        }
    },
    {
        data: new SlashCommandBuilder()
        .setName('mscrating')
        .setDescription('Current Ratings for All Competitive MSC Players'),

        async execute(interaction) {
            try {
                sql.connect(config,(err) => {
                    const request = new sql.Request();
                    const query = 'exec GetRatingsForDiscordMSC';
                    request.query(query, (err, recordset) => {
                        if (err) {
                            console.log(err);
                            interaction.reply('❌')
                        } else {
                            let mscRatings = ''
                            recordset.recordset.forEach((record) => {
                                mscRatings +=`${record.line}\n`
                            })
                            interaction.reply(mscRatings)
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
        .setName('mslmsc')
        .setDescription('MSL MSC Rankings'),

        async execute(interaction) {
            const url3 = "https://docs.google.com/spreadsheets/d/1Cf5YggxcwNVMCTyQ1Xz7wC7OaOxVoC1rQIeEJSXo6s8/gviz/tq?";
            interaction.reply("**MSL Season 1** — MSC Rankings");
			axios.get(url3)
			.then(function (response) {
				const data = JSON.parse(response.data.substr(47).slice(0,-2));
				const newData3 = [];

				data.table.rows.map((main)=>{
					newData3.push(main.c[0].v);
				})
				interaction.followUp.send(newData3.join('\n'));
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
        .setName('mscreport')
        .setDescription('Reporting MSC Matches')
        .addUserOption(option => option.setName('p1').setDescription('Player 1'))
        .addUserOption(option => option.setName('p2').setDescription('Player 2'))
        .addIntegerOption(option => option.setName('score').setDescription('Score')),

        async execute(interaction) {
            try {
               const p1 = interaction.getUser('p1').username;
               const p2 = interaction.getUser('p2').username;
               sql.connect(config, (err) => {
                    const request = new sql.Request();
                    const query = "exec reportScoreMSC @p1, @p2, @score;"
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
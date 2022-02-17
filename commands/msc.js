const { SlashCommandBuilder } = require('@discordjs/builders')
const sql = require('mssql')
const axios = require('axios')
const msc = 1; // MSC is #1!
const CONSTANTS = require('../constants');
const EMOJIS = require('../emoji');
const { config } = require('../sql_config');

const mscRegisterCommands = [
    new SlashCommandBuilder()
    .setName('msc')
    .setDescription('MSC Commands')
    .addSubcommand(subcommand =>
        subcommand
        .setName('tierlist')
        .setDescription('MSC Character Tier Rankings'))
    .addSubcommand(subcommand =>
        subcommand
        .setName('rating')
        .setDescription('Current Ratings for All Competitive MSC Players'))
    .addSubcommand(subcommand =>
        subcommand
        .setName('msl')
        .setDescription('MSL MSC Rankings'))
    .addSubcommand(subcommand =>
        subcommand
        .setName('report')
			.setDescription('Reporting MSC Matches')
			.addUserOption(option => option.setName('p1').setDescription('Player 1'))
			.addUserOption(option => option.setName('p2').setDescription('Player 2'))
            .addStringOption(option => option.setName('score').setDescription('Score')))
    .addSubcommand(subcommand =>
        subcommand
        .setName('allcomp')
        .setDescription('A randomly generated **competitive** ruleset for MSC'))
    .addSubcommand(subcommand =>
        subcommand
        .setName('allrandom')
        .setDescription('A completely randomly generated ruleset for MSC'))
    .addSubcommand(subcommand =>
        subcommand
        .setName('classic')
        .setDescription('A randomly generated **classic** msc stage'))
    .addSubcommand(subcommand =>
        subcommand
        .setName('compstage')
        .setDescription('A randomly generated **competitive** msc stage'))
    .addSubcommand(subcommand =>
        subcommand
        .setName('randomstage')
        .setDescription('A completely random msc stage'))
    .addSubcommand(subcommand =>
        subcommand
        .setName('compteam')
        .setDescription('A randomly generated **competitive** team for msc'))
    .addSubcommand(subcommand =>
        subcommand
        .setName('randomteam')
        .setDescription('A completely randomly generated msc team'))
    .addSubcommand(subcommand =>
        subcommand
        .setName('drybonesteam')
        .setDescription('A randomly generated dry bones msc team'))
    
]
    
    
mscCommands = {
    'tierlist': async(interaction) => {
        interaction.reply("https://media.discordapp.net/attachments/806813942218883073/869189371847381022/unknown.png");
		interaction.followUp("https://media.discordapp.net/attachments/806813942218883073/869189471533400074/unknown.png");
    },
    'rating': async(interaction) => {
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
                interaction.reply(chunk.join('\n'))
                    .catch((err) => {
                       console.log(err)
                    });
            });
        } catch (err) {
            console.log(err)
        }
    },
    'msl': async(interaction) => {
        const url3 = "https://docs.google.com/spreadsheets/d/1Cf5YggxcwNVMCTyQ1Xz7wC7OaOxVoC1rQIeEJSXo6s8/gviz/tq?";

				if (msg.bot) return;
				msg.channel.send("**MSL Season 1** — MSC Rankings")
					.catch((err) => {
						console.log(err)

					});;
				axios.get(url3)
					.then(function (response) {
						const data = JSON.parse(response.data.substr(47).slice(0, -2));
						const newData3 = [];

						data.table.rows.map((main) => {
							newData3.push(main.c[0].v);
						})
						interaction.reply(newData3.join('\n'))
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
    'report': async(interaction) => {
        try {
            const p1 = interaction.options.getUser('p1').username;
            const p2 = interaction.options.getUser('p2').username;
            sql.connect(config, (err) => {
                const request = new sql.Request();
                const query = "exec reportScoreMSC @gametype, @p1, @p2, @score;"
                request.input("gametype", msc);
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
    'allcomp': async(interaction) => {
        p1LastSK = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)]
				p2LastSK = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)]

				mscCaptains = CONSTANTS.MSC_CAPTAINS[Math.floor(Math.random() * CONSTANTS.MSC_CAPTAINS.length)]
				p1Captain = CONSTANTS.MSC_CAPTAINS[Math.floor(Math.random() * CONSTANTS.MSC_CAPTAINS.length)]
				remainingCaptains = CONSTANTS.MSC_CAPTAINS.filter(captain => captain !== p1Captain)
				p2Captain = remainingCaptains[Math.floor(Math.random() * remainingCaptains.length)]

				randStadium = CONSTANTS.MSC_COMP_STADIUMS[Math.floor(Math.random() * CONSTANTS.MSC_COMP_STADIUMS.length)]

				interaction.reply(`>>> ${EMOJIS[p1Captain]} ${EMOJIS.mscboo} ${EMOJIS.mscboo} ${EMOJIS[p1LastSK]}   **VS**   ${EMOJIS[p2Captain]} ${EMOJIS.mscboo} ${EMOJIS.mscboo} ${EMOJIS[p2LastSK]}\n:stadium: **${randStadium}**\n:1234: **Best of 3**\n:goal: **First to 10**`)
					.catch((err) => {
						console.log(err)

					});
    },
    'allrandom': async(interaction) => {
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

				interaction.reply(`>>> ${EMOJIS[p1Captain]} ${EMOJIS[p1SK1]} ${EMOJIS[p1SK2]} ${EMOJIS[p1SK3]}   **VS**   ${EMOJIS[p2Captain]} ${EMOJIS[p2SK1]} ${EMOJIS[p2SK2]} ${EMOJIS[p2SK3]}\n:stadium: **${randStadium}**\n:1234: **Best of ${seriesAmount}**\n:goal: **First to ${goalAmount}**`)
					.catch((err) => {
						console.log(err)
					});
    },
    'classicstage': async(interaction) => {
        interaction.reply(`>>> **${CONSTANTS.SMS_ALL_STADIUMS[Math.floor(Math.random() * CONSTANTS.SMS_ALL_STADIUMS.length)]}**`)
        .catch((err) => {
            console.log(err)

        });
    },
    'compstage': async(interaction) => {
        interaction.reply(`>>> **${CONSTANTS.MSC_COMP_STADIUMS[Math.floor(Math.random() * CONSTANTS.MSC_COMP_STADIUMS.length)]}**`)
					.catch((err) => {
						console.log(err)
					});
    },
    'randomstage': async(interaction) => {
        interaction.reply(`>>> **${CONSTANTS.MSC_ALL_STADIUMS[Math.floor(Math.random() * CONSTANTS.MSC_ALL_STADIUMS.length)]}**`)
					.catch((err) => {
						console.log(err)
					});
    },
    'compteam': async(interaction) => {
        p1LastSK = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)]
        p1Captain = CONSTANTS.MSC_CAPTAINS[Math.floor(Math.random() * CONSTANTS.MSC_CAPTAINS.length)];

            interaction.reply(`>>> ${EMOJIS[p1Captain]} ${EMOJIS.mscboo} ${EMOJIS.mscboo} ${EMOJIS[p1LastSK]}`)
                .catch((err) => {
                    console.log(err)
                });
            
    },
    'randomteam': async(interaction) => {
        p1SK1 = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)];
				p1SK2 = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)];
				p1SK3 = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)];

				p1Captain = CONSTANTS.MSC_CAPTAINS[Math.floor(Math.random() * CONSTANTS.MSC_CAPTAINS.length)];

				interaction.reply(`>>> ${EMOJIS[p1Captain]} ${EMOJIS[p1SK1]} ${EMOJIS[p1SK2]} ${EMOJIS[p1SK3]}`)
					.catch((err) => {
						console.log(err)
					});
    },
    'drybonesteam': async(interaction) => {

				p1Captain = CONSTANTS.MSC_CAPTAINS[Math.floor(Math.random() * CONSTANTS.MSC_CAPTAINS.length)];
				p1SK3 = CONSTANTS.MSC_SK[Math.floor(Math.random() * CONSTANTS.MSC_SK.length)];


				interaction.reply(`>>> ${EMOJIS[p1Captain]} ${EMOJIS.mscboo} ${EMOJIS.mscdrybones} ${EMOJIS[p1SK3]}`)
					.catch((err) => {
						console.log(err)

					});

    }
}

module.exports = { mscRegisterCommands, mscCommands }

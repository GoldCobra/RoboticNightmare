const {SlashCommandBuilder} = require('@discordjs/builders')
const sql = require('mssql')
const {config} = require('../sql_config');

const commands = [
    {
        data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription("List of All Commands"),

        async execute(interaction) {
            interaction.reply({content:"All the commands", ephemeral: true})
        }
    },
    {
        data: new SlashCommandBuilder()
        .setName('flip')
        .setDescription('Flip a coin'),

        async execute(interaction) {
			if (msg.bot) return;

				let x = Math.random();

				if (x >= .5)
					interaction.reply("heads!");
				else
					interaction.reply("tails!");
			}
    }

]

module.exports = {commands}

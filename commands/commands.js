const {SlashCommandBuilder} = require('@discordjs/builders')
const {MessageActionRow, MessageButton} = require('discord.js')
const sql = require('mssql')
const {config} = require('../sql_config');
const {CHANNELS, ROLES} = require('../constants')


const generalCommands = {
    'flip': async(interaction) => {
				let x = Math.random();

				if (x >= .5)
					interaction.reply("heads!");
				else
					interaction.reply("tails!");
            }
        
}

const generalCommandButtonCallBacks = {
    'msc': async(interaction) => {
        roleHelper(interaction, ROLES.MSC_FAN);
    },
    'msclfg': async(interaction) => {
        roleHelper(interaction, ROLES.MSC_PLAYER);
    },
    'mscdolphinlfg': async(interaction) => {
        roleHelper(interaction, ROLES.MSC_DOLPHIN);
    },
    'sms': async(interaction) => {
        roleHelper(interaction, ROLES.SMS_FAN);
    },
    'smslfg': async(interaction) => {
        roleHelper(interaction, ROLES.SMS_PLAYER);
    },
    'tournaments': async(interaction) => {
        roleHelper(interaction, ROLES.TOURNAMENT);
    },
    'modding': async(interaction) => {
        roleHelper(interaction, ROLES.MODDING);
    },
    'msbl': async(interaction) => {
        roleHelper(interaction, ROLES.MSBL);
    },
    'msbllfg': async(interaction) => {
        roleHelper(interaction, ROLES.MSBL_LFG);
    },
    'smsspectator': async(interaction) => {
        roleHelper(interaction,ROLES.SMS_SPECTATOR);
    },
    'mscspectator': async(interaction) => {
        roleHelper(interaction,ROLES.MSC_SPECTATOR);
    },
    'msblspectator': async(interaction) => {
        roleHelper(interaction, ROLES.MSBL_SPECTATOR);
    }
}

const roleHelper = (interaction, role) => {
    const user = interaction.member;
    try {
        if (user._roles.includes(role)) {
            user.roles.remove(role)
            .then(() => {
                interaction.reply({content: `We succesfully removed <@&${role}>`, ephemeral: true});
            })
            .catch(() => {
                interaction.reply({content: `We were unsuccesful removing <@&${role}>`, ephemeral:true});
            })
        } else {
            user.roles.add(role)
            .then(() => {
                interaction.reply({content: `We succesfully added <@&${role}>`, ephemeral:true});
            })
            .catch(() => {
                interaction.reply({content:`We were unsuccesful adding <@&${role}>`, ephemeral:true});
            })
        }
    } catch (err) {
        interaction.reply('Role was not updated :(')
        interaction.deleteReply();
    }
}
const generalCommandsRegister = [
    new SlashCommandBuilder()
    .setName('flip')
    .setDescription('Flip a coin')
]

module.exports = {generalCommandsRegister, generalCommands, generalCommandButtonCallBacks}

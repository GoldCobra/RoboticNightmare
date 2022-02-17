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
            },
    'buttons': async(interaction) => {
        const row = [new MessageActionRow()
            .addComponents([
                new MessageButton()
                .setCustomId('mscfan')
                .setLabel('MSC FAN')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('mscplayer')
                .setLabel('MSC PLAYER')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('mscdolphin')
                .setLabel('MSC DOLPHIN PLAYER')
                .setStyle('PRIMARY')
            ]),
            new MessageActionRow()
            .addComponents([
                new MessageButton()
                .setCustomId('smsfan')
                .setLabel('SMS FAN')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('smsplayer')
                .setLabel('SMS PLAYER')
                .setStyle('PRIMARY')
            ]),
            new MessageActionRow()
            .addComponents([
                new MessageButton()
                .setCustomId('tournaments')
                .setLabel('TOURNAMENTS')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('modding')
                .setLabel('MODDING')
                .setStyle('PRIMARY')
            ])
        ]
            interaction.reply({content: `Click the buttons below to assign your roles and see more channels!\n\nClick **MSC Fan** if you want to be added for Mario Strikers Charged talk and news.\nClick **MSC Player** if you are looking for Mario Strikers Charged games on Wii.\nClick **MSC Dolphin Player** if you are looking for Mario Strikers Charged games on Dolphin.\n\n Click **SMS Fan** if you want to be added for Super Mario Strikers talk and news.\n Click **SMS Player** if you are looking for Super Mario Strikers games on Dolphin.\n\nPlayer roles can be pinged if you are looking for a game.\n\nClick **Tournaments** to show our Mario Strikers League (MSL), Tournaments and Events sections.\nClick **Modding** if you want to show the Modding section.\n You can always click on any button again to remove your role and hide sections. \n\nGame sections\nUse <#${CHANNELS.MSC_DOMINATION_DRAFT}> and <#${CHANNELS.MSC_DOLPHIN_DRAFT}> to find opponents for Mario Strikers Charged.\nUse <#${CHANNELS.GRUDGE_MATCH}> to find opponents for Super Mario Strikers.\n\n **Be advised that inactivity may result in the removal of the "Player" role.**\n\n\n\n`, components:row})
    }
        
}

const generalCommandButtonCallBacks = {
    'mscfan': async(interaction) => {
        roleHelper(interaction, ROLES.MSC_FAN);
    },
    'mscplayer': async(interaction) => {
        roleHelper(interaction, ROLES.MSC_PLAYER);
    },
    'mscdolphin': async(interaction) => {
        roleHelper(interaction, ROLES.MSC_DOLPHIN);
    },
    'smsfan': async(interaction) => {
        roleHelper(interaction, ROLES.SMS_FAN);
    },
    'smsplayer': async(interaction) => {
        roleHelper(interaction, ROLES.SMS_PLAYER);
    },
    'tournaments': async(interaction) => {
        roleHelper(interaction, ROLES.TOURNAMENT);
    },
    'modding': async(interaction) => {
        roleHelper(interaction, ROLES.MODDING);
    }
}

const roleHelper = (interaction, role) => {
    const user = interaction.member;
    try {
        if (user._roles.includes(role)) {
            user.roles.remove(role)
            .then(() => {
                interaction.reply(`We succesfully removed <#${role}>`)
                interaction.deleteReply()
            })
            .catch(() => {
                interaction.reply(`We were unsuccesful removing <#${role}>`)
                interaction.deleteReply();
            })
        } else {
            user.roles.add(role)
            .then(() => {
                interaction.reply(`We succesfully added <#${role}>`)
                interaction.deleteReply()
            })
            .catch(() => {
                interaction.reply(`We were unsuccesful adding <#${role}>`)
                interaction.deleteReply();
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
    .setDescription('Flip a coin'),
    new SlashCommandBuilder()
    .setName('buttons')
    .setDescription('Buttons :)')
]

module.exports = {generalCommandsRegister, generalCommands, generalCommandButtonCallBacks}

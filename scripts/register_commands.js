require('dotenv').config()

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
var fs = require('fs')
const commandData = [];
const commandFiles = fs.readdirSync('./commands')
commandFiles.forEach(file => {
        require(`../commands/${file}`).commands.forEach(command => commandData.push(command.data))
});
const CONSTANTS = require('../constants')
const token = process.env.BOT_TOKEN
const rest = new REST({version:'9'}).setToken(token)
rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, CONSTANTS.GUILD_ID), {body: commandData})
        .then((data) => {
                const commandPermissions = []
                data.forEach((command) => {
                        CONSTANTS.RESTRICTED_COMMANDS.forEach((restrictedCommands) => {
                                if (restrictedCommands.commands.includes(command.name)) {
                                        restrictedCommands.allowedRoles.forEach(role => {
                                                commandPermissions.push({
                                                        id: command.id,
                                                        permissions:{
                                                                id:role,
                                                                type: 'ROLE',
                                                                permission: true
                                                        }
                                                })
                                        })
                                        return;
                                }
                        });
                });
                console.log(commandPermissions[0].permissions)
                if (commandPermissions.length > 0){
                        rest.put(Routes.guildApplicationCommandsPermissions(process.env.CLIENT_ID, CONSTANTS.GUILD_ID), {body: commandPermissions})
                }
        })
        .catch((err) => console.log(err))


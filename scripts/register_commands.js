require('dotenv').config()

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const {Permissions} = require('discord.js')
var fs = require('fs')
const commandData = [];
const {smsRegisterCommands} = require('../commands/sms');
const {mscRegisterCommands} = require('../commands/msc');
const {generalCommandsRegister} = require('../commands/commands')
const CONSTANTS = require('../constants')
const token = process.env.BOT_TOKEN
const rest = new REST({version:'9'}).setToken(token)
allCommands = smsRegisterCommands.concat(generalCommandsRegister).concat(mscRegisterCommands);
rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, CONSTANTS.GUILD_ID), {body: allCommands})
        .then((data) => {
                const commandPermissions = []
                data.forEach((command) => {
                        CONSTANTS.RESTRICTED_COMMANDS.forEach((restrictedCommands) => {
                                if (restrictedCommands.commands.includes(command.name)) {
                                        commandPermissions.push({
                                                id: command.id,
                                                permissions: restrictedCommands.allowedRoles.map(role => {
                                                        return {
                                                                id: role,
                                                                type: 1,
                                                                permission: true
                                                        }
                                                })
                                        });
                                        return;
                                }
                        });
                });
                if (commandPermissions.length > 0){
                        rest.put(Routes.guildApplicationCommandsPermissions(process.env.CLIENT_ID, CONSTANTS.GUILD_ID), {body: commandPermissions})
                }
        })
        .catch((err) => console.log(err))

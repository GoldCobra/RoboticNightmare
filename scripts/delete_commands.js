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
rest.delete(Routes.applicationGuildCommand(process.env.CLIENT_ID,CONSTANTS.GUILD_ID,process.env.npm_config_command))
        .then(() => {console.log("Command Succesfully Deleted")})
        .catch((err) => console.log(err))
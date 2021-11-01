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
if (process.env.npm_config_command == undefined) {
        if (process.env.BOT_TOKEN != process.env.NIGHTMARE_BOT_TOKEN){
                rest.get(Routes.applicationGuildCommands(process.env.CLIENT_ID, CONSTANTS.GUILD_ID))
                .then((data) => {
                        data.forEach(command => {
                                rest.delete(Routes.applicationGuildCommand(process.env.CLIENT_ID,CONSTANTS.GUILD_ID,command.id))
                                .then(() => {console.log(`Command ${command.id} Succesfully Deleted`)})
                                .catch((err) => console.log(err))  
                        })
                        
                })
                .catch((err) => console.log(err))
        } else {console.log("Cannot Mass Delete with Nightmare Bot Token")}

}
rest.delete(Routes.applicationGuildCommand(process.env.CLIENT_ID,CONSTANTS.GUILD_ID,process.env.npm_config_command))
        .then(() => {console.log("Command Succesfully Deleted")})
        .catch((err) => console.log(err))
const {SlashCommandBuilder} = require('@discordjs/builders')
const {sql} = require('mssql')
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
        .setName('upsert')
        .setDescription('Insert/Update Upsert Stored Procedure')
        .addStringOption(option => option.setName('name').setDescription('Command Name'))
        .addStringOption(option => option.setName('response').setDescription('Response to display with command')),

        async execute(interaction) {
            try {
                sql.connect(config, (err) => {
                    const request = new sql.Request();
                    const query = "exec UpsertCommand @token, @response"
                    request.input('token', interaction.getString('name'));
                    request.input('response', interaction.getString('response'));
                    request.query(query, (err, recordset) => {           
                        if (err) console.log(err) 
                    });
                });
            interaction.reply({content:'☑️', ephemeral:true});
            } catch (error) {
                console.log(error);
                interaction.reply({content:'❌', ephemeral:true});
            }
        }
    },
    {
        data: new SlashCommandBuilder()
        .setName('remove-command')
        .setDescription('Remove command from database')
        .addStringOption(option => option.setName('command').setDescription('Command To Be Removed')),

        async execute(interaction) {
            try {
                sql.connect(config, (err) => {
                    const request = new sql.Request()
                    const query = "delete from discordCommands where token = @token"
                    request.input('token', `!${interaction.getString('command')}`)
                    request.query(query, (err, recordset) => {
                        if (err) console.log(err)
                    });
                });
            interaction.reply({content:'☑️', ephemeral:true});
            } catch (error) {
                console.log(error);
                interaction.reply({content:'❌', ephemeral:true});
            }
        }
    }


]

module.exports = {commands}
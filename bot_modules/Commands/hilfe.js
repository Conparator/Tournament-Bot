const { client, config } = require('../../main');
const Discord = require('discord.js');
const datastructures = require('../Datastructures/datastructures');
const request = require('request');
const fs = require('fs');
const { help } = require('mathjs');

const command_message = datastructures.command_registry_prototype(
    "hilfe",
    "Lass dir die Hilfe anzeigen.",
    "Lass dir die Hilfe anzeigen.",
    [
        
    ],
    [

    ]
);

const command_slashcommand = datastructures.slashcommand_Global(
    "hilfe",
    "Lass dir die Hilfe anzeigen.",
    [
        {}
    ],
    [
        "782172351001001985"
    ]
);

const helpString = `__**Hilfe**__\nAlle Befehle sind sogenannte Slashcommands. Du findest sie, indem du einen Schrägstrich (/) in die Chat-Eingabebox eingibst. Sobald du dies getan hast, sollte eine Liste aller verfügbarer Slashcommands angezeigt werden. Wähle in der linken Leiste den Bot "${config.bot_name}" aus.`;

module.exports = {
    command_registry: command_message,

    slashcommand: command_slashcommand,

    exec_messagecommand(msg, args) {

        try {
            /*
            var roleObj = msg.guild.roles.cache.find(role => role.name === args);

            msg.member.roles.add(roleObj.id);

            msg.channel.send(`You received the \`${roleObj.name}\`-role.`);
            */
            msg.channel.send(`This command is currently not available as message-command.`);
        }
        catch (err) {
            console.log(err);
        }
    },

    async exec_slashCommand(interaction) {
        try {
            if (command_slashcommand.channel_whitelist.find(element => element == interaction.channelId) == undefined)
            {
                interaction.reply({ content:`Dieser Befehl ist in diesem Kanal nicht verfügbar!`, ephemeral: true });
                return;
            }

            interaction.reply({ content: helpString, ephemeral: true });
        }
        catch (err) {
            console.log(err);
        }
    }

};
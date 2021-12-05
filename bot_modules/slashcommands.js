const { client } = require('../main');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { Console } = require('console');
const { ApplicationCommand, DiscordAPIError } = require('discord.js');
const { typeOf } = require('mathjs');

module.exports = {
    async init_slashCommands() {
        var commandFiles = fs.readdirSync("./bot_modules/Commands/").filter(file => file.endsWith('.js'));
        var commands = [];

        for (const file of commandFiles) {
            console.log(file);
            const slashcommand = require(`./Commands/${file}`).slashcommand;

            const data = new SlashCommandBuilder()
                .setName(slashcommand.name)
                .setDescription(slashcommand.description);

            var cmdOptions = slashcommand.options;

            if (cmdOptions !== undefined) {
                if (cmdOptions.length > 0) {
                    for (var i in cmdOptions) {

                        switch (cmdOptions[i].type) {
                            case "string":
                                data.addStringOption(option =>
                                    option.setName(cmdOptions[i].name)
                                        .setDescription(cmdOptions[i].description)
                                        .setRequired(cmdOptions[i].required));
                                break;

                            case "integer":
                                data.addIntegerOption(option =>
                                    option.setName(cmdOptions[i].name)
                                        .setDescription(cmdOptions[i].description)
                                        .setRequired(cmdOptions[i].required));
                                break;

                            default:
                                break;
                        }
                    }
                }
            }

            commands.push(data);

        }

        const rest = new REST({ version: '9' }).setToken(config.token);

        var configJson = JSON.parse(fs.readFileSync('config.json', 'utf8'));

        //console.log(configJson)

        for (var i_guild = 0; i_guild < configJson.slashCommandGuilds.length; i_guild++) {
            //console.log("47: " + i_guild);
            await client.application.commands.fetch({ guildId: configJson.slashCommandGuilds[i_guild] }).then(liveCommands => {

                var gCommands = commands;

                //console.log("53: " + i_guild);

                //console.log(configJson.slashCommandGuilds);
                //console.log("54: " + configJson.slashCommandGuilds[i_guild]);
                //console.log(JSON.stringify(liveCommands));

                liveCommands = Array.from(liveCommands);
                if (liveCommands.length > 0 && liveCommands[0] !== undefined) {
                    gCommands = gCommands.filter(cmd => liveCommands.find(c => c[1].name == cmd.name) === null && liveCommands.find(c => c[1].name == cmd.name) == undefined); //auskommentieren, um Überschreibung/Registrierung der Befehle zu erzwingen
                }

                //console.log(JSON.stringify(gCommands));

                if (gCommands.length > 0) {
                    try {
                        (async () => {
                            try {
                                console.log('Started refreshing application (/) commands.');
                                //console.log(JSON.stringify(commands));
                                /*
                                await rest.get(
                                    Routes.applicationGuildCommands(config.client_id, config.slashCommandGuilds[i_guild]),
                                );
                                */
                                await rest.put(
                                    Routes.applicationGuildCommands(config.client_id, configJson.slashCommandGuilds[i_guild]),
                                    { body: gCommands },
                                );
                                console.log('Successfully reloaded application (/) commands.');
                            } catch (error) {
                                console.error(error);
                            }
                        })();
                    }
                    catch (err) {

                    }
                }
                else {
                    console.log(`All commands exists with same name and options in guild ${configJson.slashCommandGuilds[i_guild]}`)
                }
            });
        }
    },

    async removeAllSlashcommandsForGuild(guildId)
    {
        REST.get(Routes.applicationGuildCommands(client.user.id, guildId))
        .then(data => {
            const promises = [];
            for (const command of data) {
                const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
                promises.push(REST.delete(deleteUrl));
            }
            return Promise.all(promises);
        });
    }
};
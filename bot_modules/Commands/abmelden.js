const { client, config } = require('../../main');
const Discord = require('discord.js');
const datastructures = require('../Datastructures/datastructures');
const request = require('request');
const fs = require('fs')

const command_message = datastructures.command_registry_prototype(
    "abmelden",
    "Melde dich vom jeweiligen Event ab.",
    "Prüfe, ob der Bot verfügbar ist.",
    [

    ],
    [

    ]
);

const command_slashcommand = datastructures.slashcommand_Global(
    "abmelden",
    "Melde dich vom jeweiligen Event ab.",
    [
        {
            name: "event_id",
            value: "",
            description: "Die ID des Events.",
            required: true,
            type: "string"
        }
    ],
    [
        "782172351001001985"
    ]
);

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
            if (command_slashcommand.channel_whitelist.find(element => element == interaction.channelId) == undefined) {
                interaction.reply({ content: `Dieser Befehl ist in diesem Kanal nicht verfügbar!`, ephemeral: true });
                return;
            }

            const eventId = (interaction.options.data.some(function (o) { return o.name === "event_id"; }) === false) ? null : interaction.options.data.filter(o => o.name === "event_id")[0].value;;

            if (fs.existsSync(`./files/Events/${eventId}.json`) == false) {
                fs.copyFileSync(`./files/Events/templates/event_template.json`, `./files/Events/${eventId}.json`);
                var eventFileJson = JSON.parse(fs.readFileSync(`./files/Events/${eventId}.json`));
                eventFileJson.eventId = eventId;
                fs.writeFileSync(`./files/Events/${eventId}.json`, JSON.stringify(eventFileJson));
                console.log("Neue Event-Datei erstellt.");
            }

            var eventFileJson = JSON.parse(fs.readFileSync(`./files/Events/${eventId}.json`));

            if ((eventFileJson.participants).find(element => element.discord_snowflake == interaction.member.user.id) == undefined) {
                interaction.reply("Du hast nicht für dieses Event registriert!");
                return;
            }

            const participantId = ((eventFileJson.participants).find(element => element.discord_snowflake == interaction.member.user.id)).participantData.participant.id;

            var urlString = `https://api.challonge.com/v1/tournaments/${eventId}/participants/${participantId}.json?api_key=${config.challongeApiToken}`;

            console.log(urlString);

            request.delete(urlString, function (error, response, body) {
                console.error('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); // Print the HTML for the Google homepage.

                if (response.statusCode == 200) {
                    const participantIndex = (eventFileJson.participants).indexOf(eventFileJson.participants.find(element => element.discord_snowflake == interaction.member.user.id));
                    (eventFileJson.participants).splice(participantIndex, 1);

                    console.log(eventFileJson);

                    fs.writeFileSync(`./files/Events/${eventId}.json`, JSON.stringify(eventFileJson));

                    interaction.reply("Du hast dich erfolgreich abgemeldet.");
                }
                else
                {
                    interaction.reply("Ein Fehler ist aufgetreten.");
                }

            });
        }
        catch (err) {
            console.log(err);
        }
    }

};
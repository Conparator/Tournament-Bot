const { client, config } = require('../../main');
const Discord = require('discord.js');
const datastructures = require('../Datastructures/datastructures');
const request = require('request');
const fs = require('fs')

module.exports = {
    command_registry: datastructures.command_registry_prototype(
        "teilnehmen",
        "Melde dich für ein Event an.",
        "Melde dich für ein Event an.",
        [
            "spielername",
            "event_id"
        ],
        [
            
        ]),

    slashcommand: datastructures.slashcommand_Global(
        "teilnehmen",
        "Melde dich für ein Event an.",
        [
            {
                name: "spielername",
                value: "",
                description: "Dein Spielername.",
                required: true,
                type: "string"
            },
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
    ),

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
            //console.log(interaction);
            const playerName = (interaction.options.data.some(function(o) { return o.name === "spielername"; }) === false) ? null : interaction.options.data.filter(o => o.name === "spielername")[0].value;;
            const eventId = (interaction.options.data.some(function(o) { return o.name === "event_id"; }) === false) ? null : interaction.options.data.filter(o => o.name === "event_id")[0].value;;

            if (fs.existsSync(`./files/Events/${eventId}.json`) == false)
            {
                fs.copyFileSync(`./files/Events/templates/event_template.json`, `./files/Events/${eventId}.json`);
                var eventFileJson = JSON.parse(fs.readFileSync(`./files/Events/${eventId}.json`));
                eventFileJson.eventId = eventId;
                fs.writeFileSync(`./files/Events/${eventId}.json`, JSON.stringify(eventFileJson));
            }

            var eventFileJson = JSON.parse(fs.readFileSync(`./files/Events/${eventId}.json`));
            
            if ((eventFileJson.participants).find(element => element.discord_snowflake == interaction.member.user.id) !== undefined)
            {
                interaction.reply("Du hast dich bereits für dieses Event registriert!");
                return;
            }

            var urlString = `https://api.challonge.com/v1/tournaments/${eventId}/participants.json?api_key=${config.challongeApiToken}&participant[name]=${playerName}`;

            console.log(urlString);

            request.post(urlString, function (error, response, body) {
                console.error('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); // Print the HTML for the Google homepage.
                //(eventFileJson.participants).push(interaction.member.user.id);

                var partObj = JSON.parse(fs.readFileSync(`./files/Events/templates/participant_template.json`));
                partObj.discord_snowflake = interaction.member.user.id;
                partObj.participantData = JSON.parse(body);
                (eventFileJson.participants).push(partObj);

                console.log(eventFileJson);
                
                fs.writeFileSync(`./files/Events/${eventId}.json`, JSON.stringify(eventFileJson));
                if (response.statusCode == 200)
                {
                    interaction.reply("Du hast dich erfolgreich registriert.");
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    }

};
const Discord = require('discord.js')
const fs = require('fs')
const Embeds = require('./embeds')
const math = require('mathjs')
var os = require('os')

//os.tmpDir = os.tmpdir

var args

var args2

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Discord.Intents.FLAGS.GUILD_MEMBERS
    ]
});

client.commands = new Discord.Collection();

exports.client = client;
exports.config = config;

//bot-modules
const slashCommands_Module = require('./bot_modules/slashcommands');

//bot-modules COMMANDS
const teilnehmen_Module = require('./bot_modules/Commands/teilnehmen');

//bot-modules DATASTRUCTURES
const datastructures = require('./bot_modules/Datastructures/datastructures');

var cmdmap = {

}

var cmdmap2 = {
    listGuilds: list_guilds,
    leaveGuild: leave_guild,

    help: cmd_help,
}

var cmdmap_slashCommands =
{
    teilnehmen: teilnehmen_Module.exec_slashCommand
}

process.on('unhandledRejection', (error) => {
    console.log(error);
    fs.writeFile('./files/Error/' + Date.now() + '.txt', 'Unhandled promise rejection:\n' + error, function (err) {
        if (err) return console.log(err);
    });
});

async function cmd_help(msg, args) {
    msg.channel.send(HelpString)
}


//listGuild
async function list_guilds(msg, args) {
    var cfg = JSON.parse(fs.readFileSync('config.json', 'utf8'))
    var adminVar = cfg.adminlist
    var MSGString = '__**Bot\'s guild-list:**__\n'

    if (cfg.ownerID == msg.author.id && msg.channel.type == "dm") {

        var guildList = client.guilds.cache;

        guildList.forEach(element => {
            console.log(element.name);
            MSGString += ('`' + element.name.padEnd(30) + ' | ' + element.id + '`\n');
        });


        setTimeout(function wait() {

            msg.channel.send(MSGString, { split: true })

        }, 5000);
    }
    else {
        //Embeds.bad(msg.channel, 'You aren\'t allowed to do that!', 'Error')
        msg.channel.send('You aren\'t permitted to do this!');
    }
}

//leaveGuild-Command
async function leave_guild(msg, args) {
    var cfg = JSON.parse(fs.readFileSync('config.json', 'utf8'))
    var guildID = args
    var guildList = client.guilds.cache
    var author = msg.author

    //console.log(msg.channel.type)
    //console.log(author.id)


    //var adminVar = cfg.adminlist
    if (args !== '') {

        if (msg.channel.type == "dm" && author.id == cfg.ownerID) {
            if (guildList.has(args) == true) {
                //console.log('exists')
                //Embeds.warning(msg.channel, 'You you really want the bot to leave the guild? (5 seconds)\n' + args + '\n' + client.guilds.get(args).name)
                msg.channel.send('You you really want the bot to leave the guild? (5 seconds)\n`' + args + '`\n`' + client.guilds.cache.get(args).name + '`')

                const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 5000 });
                //console.log(collector)
                collector.on('collect', msg => {
                    if (msg.content.toUpperCase() == "YES" && msg.author.id == cfg.ownerID) {
                        try {
                            client.guilds.cache.get(args).leave()

                            //Embeds.good(msg.channel, 'Left guild!', 'Left guild!')
                            msg.channel.send('Left guild!')
                        }
                        catch (err) {
                            //Embeds.bad(msg.channel, 'Unable to leave the guild!', 'Error')
                            msg.channel.send('Unable to leave the guild!');
                            console.log(err);
                        }
                    }
                    else if (msg.content.toUpperCase() == "NO") {
                        //Embeds.good(msg.channel, 'Canceled!', 'Canceled')
                        msg.channel.send('Canceled!')
                    }
                })
            }
            else {
                //Embeds.bad(msg.channel, 'The bot isn\'t in a guild with this ID!', 'Error')
                msg.channel.send('The bot isn\'t in a guild with this ID!')
            }
        }
        else {
            //Embeds.bad(msg.channel, 'You aren\'t permitted to do this!', 'No permissions!')
            msg.channel.send('You aren\'t permitted to do this!');
        }
    }
    else {
        //Embeds.bad(msg.channel, 'An error occurred!\nPlease give a valid attribute.', 'Error')
        msg.channel.send('An error occurred!\nPlease give a valid attribute.');
        msg.channel.stopTyping(true)
    }
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    //console.log(interaction);

    cmdmap_slashCommands[interaction.commandName](interaction);
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}...`)

    slashCommands_Module.init_slashCommands();

    client.user.setActivity(`Type ${config.prefix}help`, { type: 'WATCHING' });
})

client.on('message', (msg) => {
    var cont = msg.content,
        //author = msg.member,
        user = msg.author,
        chan = msg.channel,
        guild = msg.guild

    mention = msg.mentions.users.first()

    var adminVar = config.adminlist

    var blackListVar = config.blacklist

    if (user.id != client.user.id && cont.startsWith(config.prefix)) {
        // §say test
        if (blackListVar.indexOf(user.id) == -1) {
            var invoke = cont.split(' ')[0].substr(config.prefix.length),
                args_str = cont.split(' ').slice(1)
            args = args_str.join(' ')
                .replace('\:\:', ':')
                .replace(/\:\:/g, '')
                .replace(/\\/g, '')
                .replace(/\//g, '')
                .replace(/\{/g, '')
                .replace(/\}/g, '')
                .replace(/\)/g, '')
                .replace(/\(/g, '')
                .replace(/\[/g, '')
                .replace(/\]/g, '')
                .replace(/\&/g, '')
                .replace(/\%/g, '')
                .replace(/\$/g, '')
                .replace(/\§/g, '')
                .replace(/\"/g, '')
                .replace(/\!/g, '')
                .replace(/\=/g, '')
                .replace(/\°/g, '')
                .replace(/\^/g, '')
                .replace(/\</g, '')
                .replace(/\>/g, '')
                .replace(/\;/g, '')
                .replace(/\,/g, '')
                .replace(/\_/g, '')
                .replace(/\#/g, '')
                .replace(/\~/g, '')
                .replace(/\*/g, '')
                .replace(/\+/g, '')
                .replace(/\@/g, '')
                .replace(/\€/g, '')
                .replace(/\|/g, '')
            //.replace(/\ä/g, '')
            //.replace(/\Ä/g, '')
            //.replace(/\ö/g, '')
            //.replace(/\Ö/g, '')
            //.replace(/\ü/g, '')
            //.replace(/\Ü/g, '')

            if (args.indexOf(':') > 0) {
                args2 = args.split(' : ')
            }
            //buggy:
            /*else {
                Embeds.bad(msg.channel, 'An error occured!', 'Error')
            }*/
            //console.log("Invoke: " + invoke, " args_str: " + args_str + " args: " + args + " args2: " + args2 + " blackListVar: " + blackListVar + " clientID: " + user.id + " adminList: " + adminVar)

            //Embeds.info(msg.channel, 'Shut up!', 'Info')

            if (invoke in cmdmap) {
                cmdmap[invoke](msg, args2)
            }
            else if (invoke in cmdmap2) {
                cmdmap2[invoke](msg, args)
            }
        }
        else {
            console.log('Treffer: ' + blackListVar.indexOf(user.id))
            Embeds.bad(msg.channel, 'You got blocked and aren\'t allowed to do that!', 'Error')
        }
    }
}
)

client.login(config.token)
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const Discord = require('discord.js')
const fs = require('fs')
const Embeds = require('./embeds')
const math = require('mathjs')
var os = require('os')

//os.tmpDir = os.tmpdir

var args

var args2

const client = new Discord.Client()

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'))

var HelpString = '__**Help**__\n`!!setup`: Let the bot setup the necessary roles (server-owner only).\n`!!participate`: Participate on the route/expedition. Accepts also `!!part`.\n`!!quit`: Quit the expedition/route.\n`!!docked`: Set your role to docked.\n`!!undocked`: Set your role to undocked.\n`!!follow`: Set your role to follow.\n`!!list`: List member-count of each role. You can also enter the name of one of the used roles to get a memberlist.\n`!!status`: Show your current status.'

//var funHelpString = '__**Help**__\n`§say [text]`: Repeat the text.\n`§beer`: Order a beer.\n`§whiskey`: Order a whiskey.\n`§telephone`: Send a video of a ringing telephone.\n`§xxlCoffee`: Order a XXL-coffe.\n`§compassion [OPTIONAL: Ping a member]`: Get/have compassion.\n`§kaffee`: Order a coffee.\n`§roll [question]`: Ask the Magic-8-Ball.'

var statusRoleMap = ['Follow', 'Undocked', 'Docked'];
var botRoles = ['Participant', 'Follow', 'Undocked', 'Docked'];

var cmdmap = {

}

var cmdmap2 = {
    listGuilds: list_guilds,
    leaveGuild: leave_guild,

    help: cmd_help,

    setup: setup,
    list: list,

    participate: participate,
    part: participate,
    quit: quit,
    docked: docked,
    undocked: undocked,
    follow: follow,
    status: status
}

async function cmd_help(msg, args) {
    msg.channel.send(HelpString)
}

async function setup(msg, args) {
    try {

        if (msg.guild.roles.cache.find(role => role.name === "Participant") === undefined && msg.guild.roles.cache.find(role => role.name === "Docked") === undefined && msg.guild.roles.cache.find(role => role.name === "Undocked") === undefined && (msg.author.id === msg.guild.ownerID || msg.author.id === config.ownerID)) {
            msg.guild.roles.create({ data: { name: 'Participant', hoist: false, mentionable: true } });
            msg.guild.roles.create({ data: { name: 'Docked', hoist: false, mentionable: true, color: 0x46c265 } });
            msg.guild.roles.create({ data: { name: 'Undocked', hoist: false, mentionable: true, color: 0xf7564a } });
            msg.guild.roles.create({ data: { name: 'Follow', hoist: false, mentionable: true, color : 0xbabeff } });
            msg.channel.send("Done!");
        }
        else {
            msg.channel.send("**Error!**\nThe error occurred because of one or more of the following reasons:\n- One or more of the necessary roles exist already. Delete them. (`Docked`, `Undocked`, `Participant`, `Follow`)\n- You are not the server-owner and therefore not permitted to do this.");
        }

    }
    catch (err) {
        console.log(err);
        msg.channel.send("Error! Did you already setup the roles (!!setup)?");
    }
}


async function list(msg, args) {
    //console.log(msg.guild.roles.cache.find(role => role.name === "Participant").members.array().length)
    //console.log(args)
    try {
        if (args.toUpperCase() == null || args.toUpperCase() == '') {
            msg.channel.send('__**Overview:**__\nParticipants: `' + msg.guild.roles.cache.find(role => role.name === "Participant").members.array().length + '`\nDocked: `' + msg.guild.roles.cache.find(role => role.name === "Docked").members.array().length + '`\nUndocked: `' + msg.guild.roles.cache.find(role => role.name === "Undocked").members.array().length + '`\nFollow: `' + msg.guild.roles.cache.find(role => role.name === "Follow").members.array().length + '`')
        }
        else if (args.toUpperCase() == 'PARTICIPANTS' || args.toUpperCase() == 'PART' || args.toUpperCase() == 'PARTICIPANT') {
            var partRole = msg.guild.roles.cache.find(role => role.name === "Participant");
            var roleMembers = partRole.members;
            var memberListString = '';

            roleMembers.forEach(element => {

                var currenStatusRoleName = 'N/V';

                var memberRoles = element.roles.cache;

                memberRoles.forEach(role => {

                    //console.log(role.name);

                    if (statusRoleMap.includes(role.name) == true) {

                        currenStatusRoleName = role.name;
                        
                        }
                });


                if (element.nickname == null) {
                    memberListString += (element.user.username).padEnd(25) + ' | ' + currenStatusRoleName + '\n';
                }
                else {
                    memberListString += (element.nickname).padEnd(25) + ' | ' + currenStatusRoleName + '\n';
                }
            });

            msg.channel.send('__**Participants:**__\n' + '```' + memberListString + '```');
        }

        else if (args.toUpperCase() == 'DOCKED') {
            var dockedRole = msg.guild.roles.cache.find(role => role.name === "Docked");
            var roleMembers = dockedRole.members;
            var memberListString = '';

            roleMembers.forEach(element => {
                if (element.nickname == null) {
                    memberListString += '`' + element.user.username + '`\n';
                }
                else {
                    memberListString += '`' + element.nickname + '`\n';
                }
            });

            msg.channel.send('__**Docked:**__\n' + memberListString);
        }

        else if (args.toUpperCase() == 'UNDOCKED') {
            var undockedRole = msg.guild.roles.cache.find(role => role.name === "Undocked");
            var roleMembers = undockedRole.members;
            var memberListString = '';

            roleMembers.forEach(element => {
                if (element.nickname == null) {
                    memberListString += '`' + element.user.username + '`\n';
                }
                else {
                    memberListString += '`' + element.nickname + '`\n';
                }
            });

            msg.channel.send('__**Undocked:**__\n' + memberListString);
        }

        else if (args.toUpperCase() == 'FOLLOW') {
            var followRole = msg.guild.roles.cache.find(role => role.name === "Follow");
            var roleMembers = followRole.members;
            var memberListString = '';

            roleMembers.forEach(element => {
                if (element.nickname == null) {
                    memberListString += '`' + element.user.username + '`\n';
                }
                else {
                    memberListString += '`' + element.nickname + '`\n';
                }
            });

            msg.channel.send('__**Follow:**__\n' + memberListString);
        }

    }
    catch (err) {
        console.log(err)
    }
}

async function participate(msg, args) {
    try {
        var partRole = msg.guild.roles.cache.find(role => role.name === "Participant");
        var followRole = msg.guild.roles.cache.find(role => role.name === "Follow");

        console.log(msg.member._roles)

        msg.member.roles.add(partRole.id);
        msg.member.roles.add(followRole.id);

        sendResponseText(msg, "participate");
    } catch (err) {
        console.log(err)
    }
}

async function quit(msg, args) {
    try {

        var partRole = msg.guild.roles.cache.find(role => role.name === "Participant");
        var dockedRole = msg.guild.roles.cache.find(role => role.name === "Docked");
        var undockedRole = msg.guild.roles.cache.find(role => role.name === "Undocked");
        var followRole = msg.guild.roles.cache.find(role => role.name === "Follow");

        msg.member.roles.remove(partRole.id);
        msg.member.roles.remove(dockedRole.id);
        msg.member.roles.remove(undockedRole.id);
        msg.member.roles.remove(followRole.id);

        sendResponseText(msg, "quit");
    }
    catch (err) {
        console.log(err)
    }
}

async function follow(msg, args) {


    try {
        var partRole = msg.guild.roles.cache.find(role => role.name === "Participant");
        var dockedRole = msg.guild.roles.cache.find(role => role.name === "Docked");
        var undockedRole = msg.guild.roles.cache.find(role => role.name === "Undocked");
        var followRole = msg.guild.roles.cache.find(role => role.name === "Follow");

        if (msg.member.roles.cache.has(partRole.id)) {

            msg.member.roles.add(followRole.id);

            msg.member.roles.remove(undockedRole.id);
            msg.member.roles.remove(dockedRole.id);
            sendResponseText(msg, "follow");
        }
        else {
            msg.channel.send("Please participate first!");
        }
    }
    catch (err) {
        console.log(err)
    }

}

async function docked(msg, args) {


    try {
        var partRole = msg.guild.roles.cache.find(role => role.name === "Participant");
        var dockedRole = msg.guild.roles.cache.find(role => role.name === "Docked");
        var undockedRole = msg.guild.roles.cache.find(role => role.name === "Undocked");
        var followRole = msg.guild.roles.cache.find(role => role.name === "Follow");

        if (msg.member.roles.cache.has(partRole.id)) {

            msg.member.roles.add(dockedRole.id);

            msg.member.roles.remove(undockedRole.id);
            msg.member.roles.remove(followRole.id);
            sendResponseText(msg, "docked");
        }
        else {
            msg.channel.send("Please participate first!");
        }
    }
    catch (err) {
        console.log(err)
    }

}

async function undocked(msg, args) {


    try {

        var partRole = msg.guild.roles.cache.find(role => role.name === "Participant");
        var dockedRole = msg.guild.roles.cache.find(role => role.name === "Docked");
        var undockedRole = msg.guild.roles.cache.find(role => role.name === "Undocked");
        var followRole = msg.guild.roles.cache.find(role => role.name === "Follow");

        if (msg.member.roles.cache.has(partRole.id)) {


            msg.member.roles.add(undockedRole.id);

            msg.member.roles.remove(dockedRole.id);
            msg.member.roles.remove(followRole.id);

            sendResponseText(msg, "undocked");
        }

        else {
            msg.channel.send("Please participate first!");
        }
    }
    catch (err) {
        console.log(err)
    }
}

async function status(msg, args)
{
    try {

        var partRole = msg.guild.roles.cache.find(role => role.name === "Participant");
        var dockedRole = msg.guild.roles.cache.find(role => role.name === "Docked");
        var undockedRole = msg.guild.roles.cache.find(role => role.name === "Undocked");
        var followRole = msg.guild.roles.cache.find(role => role.name === "Follow");

        var memberRoles = msg.member.roles.cache;

        var roles = '';

        memberRoles.forEach(role => {
            if (botRoles.includes(role.name) == true)
            {
                roles += role.name + '\n';
            }
        });

        msg.channel.send('Your status:\n```' + roles + '```');
    }
    catch (err) {
        console.log(err)
    }
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

//========================================================================================================

async function sendResponseText(msg, command) {
    const phrases = JSON.parse(fs.readFileSync('phrases.json', 'utf8'));

    console.log(Object.keys(phrases.participate.commodore).length)

    var text = "";

    switch (command) {
        case "participate":
            switch (msg.author.id) {
                case msg.guild.ownerID:
                    text = phrases.participate.commodore[math.randomInt(0, Object.keys(phrases.participate.commodore).length)]
                    msg.channel.send(text + '\nYour status is currently set to `Follow`. Please update it if necessary.');
                    return

                default:
                    text = phrases.participate.commander[math.randomInt(0, phrases.participate.commander.length)]

                    if (msg.member.nickname !== null) {
                        msg.channel.send(text + msg.member.nickname + '.\nYour status is currently set to `Follow`. Please update it if necessary.');
                    }
                    else {
                        msg.channel.send(text + msg.member.user.username + '\nYour status is currently set to `Follow`. Please update it if necessary.');
                    }
                    return

            }

        case "quit":
            switch (msg.author.id) {
                case msg.guild.ownerID:
                    text = phrases.quit.commodore[math.randomInt(0, phrases.quit.commodore.length)]
                    msg.channel.send(text);
                    return
                default:
                    text = phrases.quit.commander[math.randomInt(0, phrases.quit.commander.length)]
                    if (msg.member.nickname !== null) {
                        msg.channel.send(text + msg.member.nickname);
                    }
                    else {
                        msg.channel.send(text + msg.member.user.username);
                    }
                    return
            }

        case "docked":
            switch (msg.author.id) {
                case msg.guild.ownerID:
                    text = phrases.docked.commodore[math.randomInt(0, phrases.docked.commodore.length)]
                    msg.channel.send(text);
                    return
                default:
                    text = phrases.docked.commander[math.randomInt(0, phrases.docked.commander.length)]
                    if (msg.member.nickname !== null) {
                        msg.channel.send(text + msg.member.nickname);
                    }
                    else {
                        msg.channel.send(text + msg.member.user.username);
                    }
                    return
            }

        case "undocked":
            switch (msg.author.id) {
                case msg.guild.ownerID:
                    text = phrases.undocked.commodore[math.randomInt(0, phrases.undocked.commodore.length)]
                    msg.channel.send(text);
                    return
                default:
                    text = phrases.undocked.commander[math.randomInt(0, phrases.undocked.commander.length)]
                    msg.channel.send(text);
                    return
            }

        case "follow":

            text = phrases.follow.commander[math.randomInt(0, phrases.follow.commander.length)]
            msg.channel.send(text);
            return


    }
}

//========================================================================================================

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}...`)
    client.user.setActivity('Type !!help', { type: 'WATCHING' });
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
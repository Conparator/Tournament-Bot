const { MessageEmbed } = require('discord.js')

const COLORS = {
    red: 0xff0000,
    green: 0x1dc200,
    light_blue: 0xbabeff,
    blue: 0x000fff
}

module.exports = {
    
    bad(chan, cont, title)
    {
        var message
        var emb = new MessageEmbed()
        .setColor(COLORS.red)
        .setDescription(cont)
        if (title)
        {
            emb.setTitle(title)
        }
        console.log(emb)
        chan.send(emb).then((m) => {
            message = m
        })
        return message
    },

    good(chan, cont, title)
    {
        var message
        var emb = new MessageEmbed()
        .setColor(COLORS.green)
        .setDescription(cont)
        if (title)
        {
            emb.setTitle(title)
        }
        chan.send(emb).then((m) => {
            message = m
        })
        return message
    },

    info(chan, cont, title)
    {
        var message
        var emb = new MessageEmbed()
        .setColor(COLORS.light_blue)
        .setDescription(cont)
        if (title)
        {
            emb.setTitle(title)
        }
        chan.send(emb).then((m) => {
            message = m
        })
        return message
    }
}
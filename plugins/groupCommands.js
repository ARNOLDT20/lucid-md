const { cmd, commands } = require('../command')

const groupCommands = ['add', 'kick', 'remove', 'promote', 'demote', 'tagall', 'hidetag', 'mute', 'unmute', 'lock', 'unlock', 'antispam', 'antilink', 'antibot', 'welcome', 'goodbye', 'setdesc', 'setname', 'poll', 'groupinfo']

groupCommands.forEach(name => {
    if (!commands.find(c => c.pattern === name)) {
        cmd({ pattern: name, desc: `${name} group command`, category: 'group', react: '👥', filename: __filename },
            async (conn, mek, m, { from, reply }) => {
                try { reply(`Command .${name} is not implemented yet.`) } catch (e) { }
            })
    }
})

module.exports = {}

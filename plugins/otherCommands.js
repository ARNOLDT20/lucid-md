const { cmd, commands } = require('../command')

const otherCommands = ['profile', 'setbio', 'rank', 'level', 'xp', 'leaderboard', 'afk', 'mention', 'fakechat', 'fakemessage', 'spoiler', 'ascii', 'emojify', 'zalgo', 'glitch']

otherCommands.forEach(name => {
    if (!commands.find(c => c.pattern === name)) {
        cmd({ pattern: name, desc: `${name} utility`, category: 'other', react: '📦', filename: __filename },
            async (conn, mek, m, { from, reply }) => {
                try { reply(`Command .${name} is not implemented yet.`) } catch (e) { }
            })
    }
})

module.exports = {}

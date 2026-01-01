const { cmd, commands } = require('../command')

const convertCommands = ['sticker', 'stickerify', 'toimg', 'tomp3', 'tomp4', 'togif', 'voice', 'bass', 'slow', 'fast', 'reverse', 'nightcore', 'deep', 'robot']

convertCommands.forEach(name => {
    if (!commands.find(c => c.pattern === name)) {
        cmd({ pattern: name, desc: `${name} convert`, category: 'convert', react: '🔄', filename: __filename },
            async (conn, mek, m, { from, reply }) => {
                try { reply(`Command .${name} is not implemented yet.`) } catch (e) { }
            })
    }
})

module.exports = {}

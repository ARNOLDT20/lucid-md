const { cmd, commands } = require('../command')

const toolsCommands = ['calc', 'weather', 'time', 'date', 'clock', 'timezone', 'remind', 'timer', 'countdown', 'qr', 'scanqr', 'base64', 'shorturl', 'expandurl', 'uuid', 'password']

toolsCommands.forEach(name => {
    if (!commands.find(c => c.pattern === name)) {
        cmd({ pattern: name, desc: `${name} utility`, category: 'tools', react: '🛠️', filename: __filename },
            async (conn, mek, m, { from, reply }) => {
                try { reply(`Command .${name} is not implemented yet.`) } catch (e) { }
            })
    }
})

module.exports = {}

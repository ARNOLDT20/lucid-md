const { cmd, commands } = require('../command')

const aiCommands = ['ai', 'gpt', 'chatgpt', 'ask', 'bard', 'gemini', 'imagine', 'dalle', 'draw', 'imageai', 'voiceai', 'translate', 'summarize', 'rewrite', 'code', 'debug', 'explain']

aiCommands.forEach(name => {
    if (!commands.find(c => c.pattern === name)) {
        cmd({ pattern: name, desc: `${name} AI command`, category: 'ai', react: '🤖', filename: __filename },
            async (conn, mek, m, { from, reply }) => {
                try { reply(`Command .${name} is not implemented yet.`) } catch (e) { }
            })
    }
})

module.exports = {}

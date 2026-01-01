const { cmd, commands } = require('../command')

const searchCommands = ['google', 'bing', 'image', 'wiki', 'wikipedia', 'news', 'define', 'dictionary', 'synonym', 'antonym', 'movie', 'imdb', 'weather', 'lyrics', 'github', 'npm', 'apksearch']

searchCommands.forEach(name => {
    if (!commands.find(c => c.pattern === name)) {
        cmd({ pattern: name, desc: `${name} search`, category: 'search', react: '🔍', filename: __filename },
            async (conn, mek, m, { from, reply }) => {
                try { reply(`Command .${name} is not implemented yet.`) } catch (e) { }
            })
    }
})

module.exports = {}

const { cmd, commands } = require('../command')

const funCommands = ['joke', 'meme', 'fact', 'quote', 'truth', 'dare', 'ship', 'love', 'compatibility', 'iqtest', 'luck', 'coinflip', 'dice', '8ball', 'riddle', 'quiz', 'guess', 'roast', 'compliment']

funCommands.forEach(name => {
    if (!commands.find(c => c.pattern === name)) {
        cmd({ pattern: name, desc: `${name} fun command`, category: 'fun', react: '🎉', filename: __filename },
            async (conn, mek, m, { from, reply }) => {
                try { reply(`Command .${name} is not implemented yet.`) } catch (e) { }
            })
    }
})

module.exports = {}

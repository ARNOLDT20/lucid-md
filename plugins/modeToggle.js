const { cmd, commands } = require('../command')
const modeSettings = require('../lib/modeSettings')

cmd({ pattern: 'public', desc: 'Enable public mode (everyone can use commands)', category: 'owner', react: '🔓', filename: __filename }, async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply('Only owner can change mode.')
    modeSettings.setPublic(true)
    reply('Bot is now in public mode. Everyone can use commands.')
})

cmd({ pattern: 'private', desc: 'Enable private mode (only owner can use commands)', category: 'owner', react: '🔒', filename: __filename }, async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply('Only owner can change mode.')
    modeSettings.setPublic(false)
    reply('Bot is now in private mode. Only owner can use commands.')
})

cmd({ pattern: 'mode', desc: 'Show current mode', category: 'owner', react: 'ℹ️', filename: __filename }, async (conn, mek, m, { reply }) => {
    const pub = modeSettings.isPublic()
    reply(`Current mode: ${pub ? 'public' : 'private'}`)
})

module.exports = {}

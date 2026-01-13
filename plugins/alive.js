const { cmd } = require('../command')
const config = require('../config')

cmd({
    pattern: 'alive',
    desc: 'Check bot status',
    react: '✅',
    category: 'main',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: config.ALIVE_MSG }, { quoted: mek })
    } catch (e) {
        try { reply('Bot is alive') } catch (err) { }
    }
})

module.exports = {}
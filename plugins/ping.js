const { cmd } = require('../command')

cmd({
    pattern: 'ping',
    desc: "Check bot's latency and status.",
    category: 'main',
    react: '⚡',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const start = Date.now()
        const res = await conn.sendMessage(from, { text: 'Pinging...' }, { quoted: mek })
        const latency = Date.now() - start
        // edit message if edit supported
        if (conn.edit) {
            await conn.edit(res, `Pong! ${latency} ms`)
        } else {
            await conn.sendMessage(from, { text: `Pong! ${latency} ms` }, { quoted: mek })
        }
    } catch (e) {
        console.error('ping error:', e)
        reply('Ping failed')
    }
})

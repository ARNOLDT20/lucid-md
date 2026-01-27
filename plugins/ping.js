const { cmd, commands } = require('../command')
const config = require('../config')
const { getBuffer } = require('../lib/functions')

const PING_AUDIO_URL = 'https://files.catbox.moe/lu3f94.mp3'

const FORWARD_WITH_AD = {
    isForwarded: true,
    forwardingScore: 999,
    externalAdReply: {
        title: "⚡ LUCID MD",
        body: "Fast • Stable • Online",
        thumbnailUrl: "https://files.catbox.moe/82aewo.png",
        mediaType: 1,
        renderLargerThumbnail: true
    }
}

/* ======================
   PING COMMAND
====================== */
if (!commands.find(c => c.pattern === 'ping')) cmd({
    pattern: 'ping',
    desc: 'Check bot speed',
    category: 'main',
    react: '🏓',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const start = Date.now()

        // ⏳ Pinging message
        await conn.sendMessage(
            from,
            {
                text: "⚡ *Pinging server...*",
                ...(config.FORWARD_PING_ON_DEPLOY ? { contextInfo: FORWARD_WITH_AD } : {})
            },
            { quoted: mek }
        )

        const latency = Date.now() - start

        // 🎨 UI RESPONSE
        const uiText = `
╭━━━〔 ⚡ PING STATUS ⚡ 〕━━━╮
┃ 🤖 Bot: LUCID MD
┃ ⚙️ Status: Online
┃ ⏱️ Speed: ${latency} ms
╰━━━━━━━━━━━━━━━━━━━━━━╯
`.trim()

        await conn.sendMessage(
            from,
            {
                text: uiText,
                ...(config.FORWARD_PING_ON_DEPLOY ? { contextInfo: FORWARD_WITH_AD } : {})
            },
            { quoted: mek }
        )

        // 🔊 AUDIO RESPONSE
        try {
            const audioBuffer = await getBuffer(PING_AUDIO_URL)
            if (audioBuffer) {
                await conn.sendMessage(
                    from,
                    {
                        audio: audioBuffer,
                        mimetype: 'audio/mpeg',
                        ptt: false,
                        ...(config.FORWARD_PING_ON_DEPLOY ? { contextInfo: FORWARD_WITH_AD } : {})
                    },
                    { quoted: mek }
                )
            }
        } catch (err) {
            console.error('[PING AUDIO ERROR]', err)
        }
    } catch (err) {
        console.error('[PING ERROR]', err)
        if (reply) reply('❌ Ping command failed')
    }
})

module.exports = {}

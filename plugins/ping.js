const { cmd } = require('../command')
const googleTTS = require('google-tts-api')
const { getBuffer } = require('../lib/functions')
const config = require('../config')

const FORWARD_META = {
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
        newsletterJid: "120363420222821450@newsletter",
        newsletterName: "@T20_starboy",
        serverMessageId: -1
    }
}

cmd({
    pattern: 'ping',
    desc: "Check bot's latency and status (with audio).",
    category: 'main',
    react: '⚡',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const start = Date.now()
        const res = await conn.sendMessage(from, { text: 'Pinging...', ...(config.FORWARD_PING_ON_DEPLOY ? { contextInfo: FORWARD_META } : {}) }, { quoted: mek })
        const latency = Date.now() - start
        const text = `Pong! ${latency} ms`
        // edit message if edit supported
        if (config.FORWARD_PING_ON_DEPLOY) {
            // when forwarding is enabled, send a new forwarded-styled message instead of editing
            await conn.sendMessage(from, { text, ...(config.FORWARD_PING_ON_DEPLOY ? { contextInfo: FORWARD_META } : {}) }, { quoted: mek })
        } else if (conn.edit) {
            await conn.edit(res, text)
        } else {
            await conn.sendMessage(from, { text }, { quoted: mek })
        }

        // generate TTS audio and send
        try {
            const ttsUrl = googleTTS.getAudioUrl(text, { lang: 'en', slow: false, host: 'https://translate.google.com' })
            const audioBuffer = await getBuffer(ttsUrl)
            if (audioBuffer) {
                await conn.sendMessage(from, { audio: audioBuffer, mimetype: 'audio/mpeg', ...(config.FORWARD_PING_ON_DEPLOY ? { contextInfo: FORWARD_META } : {}) }, { quoted: mek })
            }
        } catch (ttsErr) {
            console.error('ping TTS error:', ttsErr)
        }

    } catch (e) {
        console.error('ping error:', e)
        reply('Ping failed')
    }
})

const { cmd } = require('../command')
const googleTTS = require('google-tts-api')
const { getBuffer } = require('../lib/functions')

cmd({
    pattern: 'ping',
    desc: "Check bot's latency and status (with audio).",
    category: 'main',
    react: '⚡',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const start = Date.now()
        const res = await conn.sendMessage(from, { text: 'Pinging...' }, { quoted: mek })
        const latency = Date.now() - start
        const text = `Pong! ${latency} ms`
        // edit message if edit supported
        if (conn.edit) {
            await conn.edit(res, text)
        } else {
            await conn.sendMessage(from, { text }, { quoted: mek })
        }

        // generate TTS audio and send
        try {
            const ttsUrl = googleTTS.getAudioUrl(text, { lang: 'en', slow: false, host: 'https://translate.google.com' })
            const audioBuffer = await getBuffer(ttsUrl)
            if (audioBuffer) {
                await conn.sendMessage(from, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: mek })
            }
        } catch (ttsErr) {
            console.error('ping TTS error:', ttsErr)
        }

    } catch (e) {
        console.error('ping error:', e)
        reply('Ping failed')
    }
})

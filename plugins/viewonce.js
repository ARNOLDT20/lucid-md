const { cmd } = require('../command')

cmd({
    pattern: 'viewonce',
    alias: ['vv', 'open', 'view'],
    desc: 'Open a view-once media by replying to it',
    category: 'tools',
    react: '👁️',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        if (!m.quoted) return reply('Reply to a view-once message with .viewonce')
        // download quoted media (sms adds .download on quoted)
        const buffer = await (m.quoted.download ? m.quoted.download() : null)
        if (!buffer) return reply('Failed to download the quoted media or it is not a media message.')

        const type = m.quoted.type || ''
        if (type.includes('image')) {
            await conn.sendMessage(from, { image: buffer, caption: 'Opened view-once image' }, { quoted: mek })
        } else if (type.includes('video')) {
            await conn.sendMessage(from, { video: buffer, caption: 'Opened view-once video', mimetype: 'video/mp4' }, { quoted: mek })
        } else if (type.includes('audio')) {
            await conn.sendMessage(from, { audio: buffer, mimetype: 'audio/mpeg' }, { quoted: mek })
        } else if (type.includes('sticker') || type.includes('webp')) {
            await conn.sendMessage(from, { sticker: buffer }, { quoted: mek })
        } else {
            await conn.sendMessage(from, { document: buffer, fileName: 'viewonce_media', mimetype: 'application/octet-stream' }, { quoted: mek })
        }
    } catch (e) {
        console.error('viewonce command error:', e)
        reply('Error opening view-once media.')
    }
})

module.exports = {}

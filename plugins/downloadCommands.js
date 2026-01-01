const { cmd, commands } = require('../command')
const yts = require('yt-search')
const fg = require('api-dylux')

async function handleYtAudio(conn, mek, m, { from, q, reply }) {
    if (!q) return reply('Usage: .song <YouTube URL or search query>')
    try {
        let url = q
        if (!q.startsWith('http')) {
            const r = await yts(q)
            if (!r || !r.videos || r.videos.length === 0) return reply('No results found for your query.')
            url = r.videos[0].url
        }
        reply('*Processing audio...*')
        const down = await fg.yta(url)
        if (!down || !down.dl_url) return reply('Failed to fetch audio download link.')
        await conn.sendMessage(from, { audio: { url: down.dl_url }, mimetype: 'audio/mpeg', fileName: (down.title || 'audio') + '.mp3' }, { quoted: mek })
        await conn.sendMessage(from, { document: { url: down.dl_url }, fileName: (down.title || 'audio') + '.mp3', mimetype: 'audio/mpeg' }, { quoted: mek })
    } catch (e) {
        console.error('yt audio error:', e)
        reply('Error downloading audio.')
    }
}

async function handleYtVideo(conn, mek, m, { from, q, reply }) {
    if (!q) return reply('Usage: .video <YouTube URL or search query>')
    try {
        let url = q
        if (!q.startsWith('http')) {
            const r = await yts(q)
            if (!r || !r.videos || r.videos.length === 0) return reply('No results found for your query.')
            url = r.videos[0].url
        }
        reply('*Processing video...*')
        const down = await fg.ytv(url)
        if (!down || !down.dl_url) return reply('Failed to fetch video download link.')
        await conn.sendMessage(from, { video: { url: down.dl_url }, mimetype: 'video/mp4', fileName: (down.title || 'video') + '.mp4' }, { quoted: mek })
        await conn.sendMessage(from, { document: { url: down.dl_url }, fileName: (down.title || 'video') + '.mp4', mimetype: 'video/mp4' }, { quoted: mek })
    } catch (e) {
        console.error('yt video error:', e)
        reply('Error downloading video.')
    }
}

// register aliases for audio
['song', 'ytaudio', 'ytmp3'].forEach(name => {
    if (!commands.find(c => c.pattern === name)) {
        cmd({ pattern: name, desc: `${name} download`, category: 'download', react: '🎵', filename: __filename }, async (conn, mek, m, ctx) => {
            return handleYtAudio(conn, mek, m, ctx)
        })
    }
})

// register aliases for video
['video', 'ytvideo', 'ytmp4', 'playvideo', 'play'].forEach(name => {
    if (!commands.find(c => c.pattern === name)) {
        cmd({ pattern: name, desc: `${name} download`, category: 'download', react: '📽️', filename: __filename }, async (conn, mek, m, ctx) => {
            return handleYtVideo(conn, mek, m, ctx)
        })
    }
})

// other download commands: provide placeholder responses directing to primary commands
const otherPlaceholders = ['fb', 'facebook', 'instagram', 'insta', 'twitter', 'tiktok', 'tt', 'mediafire', 'gdrive', 'apk', 'spotify', 'lyrics']
otherPlaceholders.forEach(name => {
    if (!commands.find(c => c.pattern === name)) {
        cmd({ pattern: name, desc: `${name} download (placeholder)`, category: 'download', react: '📥', filename: __filename }, async (conn, mek, m, { reply }) => {
            reply(`Command .${name} is not fully implemented. Use .song or .video for YouTube downloads.`)
        })
    }
})

module.exports = {}

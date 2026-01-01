const { cmd, commands } = require('../command')
const yts = require('yt-search')
const fg = require('api-dylux')
const axios = require('axios')

// Download safeguards
const MAX_MEDIA_BYTES = process.env.MAX_MEDIA_BYTES ? parseInt(process.env.MAX_MEDIA_BYTES) : (30 * 1024 * 1024) // 30MB
const DOWNLOAD_RATE_LIMIT = process.env.DOWNLOAD_RATE_LIMIT ? parseInt(process.env.DOWNLOAD_RATE_LIMIT) : 2 // max downloads
const DOWNLOAD_RATE_WINDOW = process.env.DOWNLOAD_RATE_WINDOW ? parseInt(process.env.DOWNLOAD_RATE_WINDOW) : (60 * 1000) // per minute
const downloadMap = {} // { user: [timestamps] }

function isDownloadRateLimited(user) {
    try {
        const now = Date.now()
        const arr = (downloadMap[user] || []).filter(ts => now - ts < DOWNLOAD_RATE_WINDOW)
        if (arr.length >= DOWNLOAD_RATE_LIMIT) {
            downloadMap[user] = arr
            return true
        }
        arr.push(now)
        downloadMap[user] = arr
        return false
    } catch (e) {
        return false
    }
}

async function handleYtAudio(conn, mek, m, { from, q, reply, senderNumber, isOwner }) {
    if (!q) return reply('Usage: .song <YouTube URL or search query>')
    try {
        let url = q
        if (!q.startsWith('http')) {
            const r = await yts(q)
            if (!r || !r.videos || r.videos.length === 0) return reply('No results found for your query.')
            url = r.videos[0].url
        }
        // rate-limit per user
        const userKey = senderNumber || (from && from.split('@')[0])
        if (!isOwner && isDownloadRateLimited(userKey)) return reply('Download commands are rate-limited. Please try again later.')

        reply('*Processing audio...*')
        const down = await fg.yta(url)
        if (!down || !down.dl_url) return reply('Failed to fetch audio download link.')
        // check remote content-length to avoid huge files
        try {
            const head = await axios.head(down.dl_url, { timeout: 10000 })
            const len = head.headers['content-length'] ? parseInt(head.headers['content-length']) : null
            if (len && len > MAX_MEDIA_BYTES) return reply('The file is too large to send (>' + Math.round(MAX_MEDIA_BYTES / (1024 * 1024)) + 'MB).')
        } catch (e) {
            // ignore HEAD errors but continue cautiously
        }
        // record usage
        isDownloadRateLimited(userKey)
        await conn.sendMessage(from, { audio: { url: down.dl_url }, mimetype: 'audio/mpeg', fileName: (down.title || 'audio') + '.mp3' }, { quoted: mek })
        await conn.sendMessage(from, { document: { url: down.dl_url }, fileName: (down.title || 'audio') + '.mp3', mimetype: 'audio/mpeg' }, { quoted: mek })
    } catch (e) {
        console.error('yt audio error:', e)
        reply('Error downloading audio.')
    }
}

async function handleYtVideo(conn, mek, m, { from, q, reply, senderNumber, isOwner }) {
    if (!q) return reply('Usage: .video <YouTube URL or search query>')
    try {
        let url = q
        if (!q.startsWith('http')) {
            const r = await yts(q)
            if (!r || !r.videos || r.videos.length === 0) return reply('No results found for your query.')
            url = r.videos[0].url
        }
        const userKey = senderNumber || (from && from.split('@')[0])
        if (!isOwner && isDownloadRateLimited(userKey)) return reply('Download commands are rate-limited. Please try again later.')

        reply('*Processing video...*')
        const down = await fg.ytv(url)
        if (!down || !down.dl_url) return reply('Failed to fetch video download link.')
        try {
            const head = await axios.head(down.dl_url, { timeout: 10000 })
            const len = head.headers['content-length'] ? parseInt(head.headers['content-length']) : null
            if (len && len > MAX_MEDIA_BYTES) return reply('The file is too large to send (>' + Math.round(MAX_MEDIA_BYTES / (1024 * 1024)) + 'MB).')
        } catch (e) {
            // ignore HEAD errors
        }
        isDownloadRateLimited(userKey)
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

const { cmd } = require('../command')
const yts = require('yt-search')
const fg = require('api-dylux')

cmd({
    pattern: 'getsong',
    desc: 'Download song (YouTube URL or search query)',
    category: 'download',
    react: '🎵',
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, args, q, reply }) => {
    try {
        if (!q) return reply('Usage: .getsong <YouTube URL or search query>')
        let url = q
        // if not a url, search YouTube
        if (!q.startsWith('http')) {
            const r = await yts(q)
            if (!r || !r.videos || r.videos.length === 0) return reply('No results found for your query.')
            url = r.videos[0].url
        }
        reply('*Processing audio...*')
        const down = await fg.yta(url)
        if (!down || !down.dl_url) return reply('Failed to fetch audio download link.')
        // send as audio and as document for compatibility
        await conn.sendMessage(from, { audio: { url: down.dl_url }, mimetype: 'audio/mpeg', fileName: (down.title || 'audio') + '.mp3' }, { quoted: mek })
        await conn.sendMessage(from, { document: { url: down.dl_url }, fileName: (down.title || 'audio') + '.mp3', mimetype: 'audio/mpeg' }, { quoted: mek })
    } catch (e) {
        console.error('getsong error:', e)
        reply('Error downloading song.')
    }
})

cmd({
    pattern: 'getvideo',
    desc: 'Download video (YouTube URL or search query)',
    category: 'download',
    react: '📽️',
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, args, q, reply }) => {
    try {
        if (!q) return reply('Usage: .getvideo <YouTube URL or search query>')
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
        console.error('getvideo error:', e)
        reply('Error downloading video.')
    }
})

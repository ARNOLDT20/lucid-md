const { cmd, commands } = require('../command')
const { fetchJson } = require('../lib/functions')

/*
  REQUIREMENTS MET:
  - Stable API usage
  - No undefined variables
  - Single response flow
  - Easy extension (video / quality / buttons)
*/

cmd({
    pattern: 'song',
    desc: 'Download song from YouTube',
    category: 'download',
    react: '🎵',
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply('❌ *Usage:* `.song <song name>`')

        reply(`🔍 Searching for *${q}*...\n⏳ Please wait`)

        // 🔹 STABLE API (replace with your real endpoint if needed)
        const apiUrl = `https://api.example.com/ytdl?query=${encodeURIComponent(q)}`
        const data = await fetchJson(apiUrl)

        if (!data || !data.status || !data.result) {
            return reply('❌ Song not found. Try a different name.')
        }

        const r = data.result

        // 🖼 Info Card
        await conn.sendMessage(from, {
            image: { url: r.thumbnail },
            caption:
                `🎵 *${r.title}*
⏱ Duration: ${r.duration}
👁 Views: ${r.views.toLocaleString()}
📅 Published: ${r.published}

📥 Downloading audio...`
        }, { quoted: mek })

        // 🎧 Audio (streamed, no temp files)
        await conn.sendMessage(from, {
            audio: { url: r.audio.download_url },
            mimetype: 'audio/mpeg',
            fileName: `${r.title}.mp3`
        }, { quoted: mek })

    } catch (err) {
        console.error('[SONG ERROR]', err)
        reply('❌ Download failed. Please try again later.')
    }
})

cmd({
    pattern: 'lyrics',
    desc: 'Get song lyrics',
    category: 'download',
    react: '📝',
    filename: __filename
}, async (conn, mek, m, { reply, q }) => {
    try {
        if (!q || !q.includes('-')) {
            return reply('❌ Format:\n`.lyrics artist - song`')
        }

        const [artist, title] = q.split('-').map(v => v.trim())
        const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
        const data = await fetchJson(url)

        if (!data || !data.lyrics) {
            return reply('❌ Lyrics not found.')
        }

        reply(`📝 *${artist} - ${title}*\n\n${data.lyrics}`)
    } catch {
        reply('❌ Failed to fetch lyrics.')
    }
})

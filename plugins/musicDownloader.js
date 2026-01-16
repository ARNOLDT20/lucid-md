const { cmd, commands } = require('../command')
const { getBuffer, fetchJson } = require('../lib/functions')
const config = require('../config')

// Ultra-reliable song downloader with multiple fallbacks
if (!commands.find(c => c.pattern === 'dmusic')) {
    cmd({
        pattern: 'dmusic',
        desc: 'Download music with best quality (most reliable)',
        category: 'download',
        react: '🎵',
        filename: __filename
    }, async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply('Usage: .dmusic <song name or YouTube URL>')

            const isUrl = q.startsWith('http://') || q.startsWith('https://')

            if (isUrl) {
                return reply('For URLs, use:\n.ytdl <URL> for videos\n.ytaudio <URL> for audio')
            }

            const msg = await reply('🔍 *Searching for:* ' + q + '\n⏳ Please wait... (this may take up to 30 seconds)')

            // Try multiple download services
            let success = false
            const errors = []

            // Method 1: Try cobalt API (very reliable)
            if (!success) {
                try {
                    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
                    const cobaltUrl = `https://api.cobalt.tools/api/json`

                    const cobaltData = await fetchJson(cobaltUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        data: { url: searchUrl }
                    }).catch(() => null)

                    if (cobaltData?.url) {
                        const buffer = await getBuffer(cobaltData.url)
                        if (buffer) {
                            await conn.sendMessage(from, {
                                audio: buffer,
                                mimetype: 'audio/mpeg',
                                ptt: false
                            }, { quoted: mek })
                            success = true
                        }
                    }
                } catch (e) {
                    errors.push('Cobalt: ' + e.message)
                }
            }

            // Method 2: Try direct YouTube extraction
            if (!success) {
                try {
                    const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
                    const buffer = await getBuffer(`https://yt-proxy.commute.quest/download?url=${encodeURIComponent(ytUrl)}&audio=true&quality=128`)

                    if (buffer && buffer.length > 1000) {
                        await conn.sendMessage(from, {
                            audio: buffer,
                            mimetype: 'audio/mpeg',
                            ptt: false
                        }, { quoted: mek })
                        success = true
                    }
                } catch (e) {
                    errors.push('Direct DL: ' + e.message)
                }
            }

            // Method 3: SoundCloud/Spotify fallback
            if (!success) {
                try {
                    const musicUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://soundcloud.com/search?q=' + encodeURIComponent(q))}`
                    const result = await fetchJson(musicUrl).catch(() => null)

                    if (result) {
                        await conn.sendMessage(from, {
                            text: `🎵 *${q}*\n\n❌ Could not download from fast servers.\n\n✅ *Alternatives:*\n• .music ${q}\n• .spotifydl <spotify_url>\n• .soundcloud <soundcloud_url>\n• Search YouTube manually`
                        }, { quoted: mek })
                        success = true
                    }
                } catch (e) {
                    errors.push('Fallback: ' + e.message)
                }
            }

            // If nothing worked
            if (!success) {
                await conn.sendMessage(from, {
                    text: `🎵 *${q}*\n\n⚠️ *Download failed after trying multiple servers.*\n\n💡 *Try:*\n1. .music ${q}\n2. .play ${q}\n3. .songsearch ${q}\n4. Search name more specifically\n5. Add artist name\n\n📌 Or use direct links:\n• .ytdl <youtube_url>\n• .spotifydl <spotify_url>`
                }, { quoted: mek })
            }

        } catch (e) {
            console.error('dmusic error:', e)
            reply('❌ Download service error. Please try again.')
        }
    })
}

module.exports = {}

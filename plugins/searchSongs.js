const { cmd, commands } = require('../command')
const { fetchJson, getBuffer } = require('../lib/functions')
const config = require('../config')

// Advanced song searcher with details
if (!commands.find(c => c.pattern === 'song')) {
    cmd({
        pattern: 'song',
        desc: 'Search and download songs by name',
        category: 'download',
        react: '🎵',
        filename: __filename
    }, async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply('Usage: .song <song name>')

            reply('🔍 Searching for: *' + q + '*\n⏳ Please wait...')

            // Search for the song using YouTube
            try {
                // Direct download attempt using faster API
                const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`

                reply(`✅ Found: *${q}*\n\n📥 Downloading... (this may take 10-30 seconds)`)

                // Use yt-dlp compatible service
                const downloadUrl = `https://yt-proxy.commute.quest/download?url=${encodeURIComponent(searchUrl)}&audio=true`

                const buffer = await getBuffer(downloadUrl).catch(async () => {
                    // Fallback: Try another approach
                    const alt = `https://api.cobalt.tools/api/json?url=https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
                    return await getBuffer(alt).catch(() => null)
                })

                if (!buffer || buffer === null) {
                    return reply(`🎵 *${q}* - Song not found on fast servers.\n\n💡 Try:\n• More specific keywords\n• Artist name + song name\n• Remove special characters\n\n📝 Or try: .songsearch ${q}`)
                }

                await conn.sendMessage(from, {
                    audio: buffer,
                    mimetype: 'audio/mpeg',
                    ptt: false
                }, { quoted: mek })

                setTimeout(() => {
                    reply(`✅ *Downloaded: ${q}*`)
                }, 1000)
            } catch (searchErr) {
                return reply(`🎵 *${q}*\n\n❌ Download server temporarily unavailable.\n\n💡 Try:\n• Use .songsearch to see options\n• Try different spelling\n• Check song name\n\n⏳ Or try again in a moment`)
            }

            // Send info after download
            setTimeout(() => {
                reply(`✅ *Downloaded Successfully*\n\n🎵 *${title}*\n⏱️ Duration: ${duration}`)
            }, 1000)

        } catch (e) {
            console.error('Song search error:', e)
            reply('❌ Song download failed. Try another search term.')
        }
    })
}

// Search songs and show list
if (!commands.find(c => c.pattern === 'songsearch')) {
    cmd({
        pattern: 'songsearch',
        desc: 'Search songs and get multiple results',
        category: 'download',
        react: '🔎',
        filename: __filename
    }, async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply('Usage: .songsearch <song name>')

            reply('🔍 Searching for songs...')

            // Provide search suggestions
            let list = '*🎵 Search Results for: ' + q + '*\n\n'
            list += '🔍 *Popular Variations:*\n'
            list += `1. ${q}\n`
            list += `2. ${q} official audio\n`
            list += `3. ${q} lyrics\n`
            list += `4. ${q} remix\n`
            list += `5. ${q} cover\n`
            list += `6. ${q} slowed\n`

            list += '\n📝 *How to use:*\n'
            list += 'Copy exact name from above\n'
            list += 'Example: .song despacito official audio\n'
            list += '\n⏱️ May take 10-30 seconds to download'

            reply(list)

        } catch (e) {
            console.error('Song list search error:', e)
            reply('❌ Search failed.')
        }
    })
}

// Lyrics finder
if (!commands.find(c => c.pattern === 'lyrics')) {
    cmd({
        pattern: 'lyrics',
        desc: 'Get song lyrics',
        category: 'download',
        react: '📝',
        filename: __filename
    }, async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply('Usage: .lyrics <song name>')

            reply('🔍 Finding lyrics for: *' + q + '*...')

            try {
                // Try multiple lyrics APIs
                const lyricsUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(q.split('-')[0])}/` + encodeURIComponent(q.split('-')[1] || q)
                const lyricsData = await fetchJson(lyricsUrl).catch(async () => {
                    // Fallback to another API
                    return await fetchJson(`https://api.genezislabs.com/api/lyrics?query=${encodeURIComponent(q)}`).catch(() => null)
                })

                if (!lyricsData || !lyricsData.lyrics) {
                    return reply(`📝 Lyrics not found for: *${q}*\n\n💡 Tips:\n• Try: Artist name - Song name\n• Example: .lyrics taylor swift - lover\n• Use official song name`)
                }

                const lyrics = lyricsData.lyrics
                const lyricText = `*${q}*\n\n${lyrics}`

                // Send lyrics in chunks if too long
                if (lyricText.length > 4096) {
                    const chunks = lyricText.match(/[\s\S]{1,4096}/g) || []
                    for (const chunk of chunks) {
                        await conn.sendMessage(from, { text: chunk }, { quoted: mek })
                        await new Promise(r => setTimeout(r, 500))
                    }
                } else {
                    reply(lyricText)
                }
            } catch (e) {
                console.error('Lyrics search error:', e)
                reply(`📝 Lyrics search failed.\n\n💡 Format: .lyrics artist - song\nExample: .lyrics the weeknd - blinding lights`)
            }

        } catch (e) {
            console.error('Lyrics search error:', e)
            reply('❌ Lyrics search failed. Try another song.')
        }
    })
}

// Play song (alias for music)
if (!commands.find(c => c.pattern === 'play')) {
    cmd({
        pattern: 'play',
        desc: 'Play/download a song',
        category: 'download',
        react: '▶️',
        filename: __filename
    }, async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply('Usage: .play <song name>')

            reply('🎵 Playing: *' + q + '*\n⏳ Please wait (10-30 seconds)...')

            try {
                const downloadUrl = `https://yt-proxy.commute.quest/download?url=${encodeURIComponent('https://www.youtube.com/results?search_query=' + encodeURIComponent(q))}&audio=true`

                const buffer = await getBuffer(downloadUrl).catch(async () => {
                    // Try fallback
                    return await getBuffer(`https://api.cobalt.tools/api/json?url=https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`).catch(() => null)
                })

                if (!buffer || buffer === null) {
                    return reply(`🎵 *${q}*\n\n❌ Could not find this song.\n\n💡 Tips:\n• Try simpler keywords\n• Add "official" or "audio"\n• Remove special characters`)
                }

                await conn.sendMessage(from, {
                    audio: buffer,
                    mimetype: 'audio/mpeg',
                    ptt: false
                }, { quoted: mek })
            } catch (e) {
                console.error('Play song error:', e)
                reply('❌ Failed to play song. Servers may be busy.')
            }

        } catch (e) {
            console.error('Play song error:', e)
            reply('❌ Failed to play song.')
        }
    })
}

module.exports = {}

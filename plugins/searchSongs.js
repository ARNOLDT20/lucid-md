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

            // Search for the song
            const url = `https://api.ryzendesu.vip/api/search/mp3?query=${encodeURIComponent(q)}`
            const data = await fetchJson(url)

            if (!data || !data.result || data.result.length === 0) {
                return reply('❌ No songs found for: *' + q + '*\n\nTry searching with a different name.')
            }

            const song = data.result[0]
            const downloadUrl = song.url || song.download_url

            if (!downloadUrl) return reply('❌ Could not find download link.')

            const title = song.title || q
            const duration = song.duration || 'unknown'

            await conn.sendMessage(from, {
                audio: await getBuffer(downloadUrl),
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: mek })

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

            const url = `https://api.ryzendesu.vip/api/search/mp3?query=${encodeURIComponent(q)}`
            const data = await fetchJson(url)

            if (!data || !data.result || data.result.length === 0) {
                return reply('❌ No songs found for: *' + q + '*')
            }

            let list = '*🎵 Search Results for: ' + q + '*\n\n'
            data.result.slice(0, 5).forEach((song, index) => {
                list += `${index + 1}. ${song.title || 'Unknown'}\n`
            })

            list += '\n💬 Reply with .song <exact name> to download any result'

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

            reply('🔍 Finding lyrics...')

            // Try to fetch lyrics
            const url = `https://some-random-api.com/lyrics?title=${encodeURIComponent(q)}`
            const data = await fetchJson(url)

            if (!data || !data.lyrics) {
                return reply('❌ Lyrics not found for: *' + q + '*')
            }

            const lyrics = data.lyrics
            const title = data.title || q
            const artist = data.artist || 'Unknown Artist'

            // Send lyrics in chunks if too long
            const lyricText = `*${title}*\n_by ${artist}_\n\n${lyrics}`

            if (lyricText.length > 4096) {
                // Split into multiple messages
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

            reply('🎵 Playing: *' + q + '*\n⏳ Please wait...')

            const url = `https://api.ryzendesu.vip/api/search/mp3?query=${encodeURIComponent(q)}`
            const data = await fetchJson(url)

            if (!data || !data.result || data.result.length === 0) {
                return reply('❌ Song not found.')
            }

            const song = data.result[0]
            const audioUrl = song.url || song.download_url

            if (!audioUrl) return reply('❌ Could not get audio link.')

            await conn.sendMessage(from, {
                audio: await getBuffer(audioUrl),
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: mek })

        } catch (e) {
            console.error('Play song error:', e)
            reply('❌ Failed to play song.')
        }
    })
}

module.exports = {}

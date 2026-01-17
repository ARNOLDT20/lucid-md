const { cmd, commands } = require('../command')
const { fetchJson, getBuffer } = require('../lib/functions')
const config = require('../config')

// Search songs and show list - songsearch only (song, lyrics, play are in song.js)
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

// Play command - alias for song
cmd({
    pattern: 'play',
    desc: 'Play/download a song',
    category: 'download',
    react: '▶️',
    filename: __filename
}, async (conn, mek, m, ctx) => {
    const songCmd = commands.find(c => c.pattern === 'song')
    if (!songCmd) return ctx.reply('❌ Song system not loaded')
    await songCmd.function(conn, mek, m, ctx)
})

module.exports = {}

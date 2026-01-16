const { cmd, commands } = require('../command')
const { fetchJson, getBuffer } = require('../lib/functions')
const axios = require('axios')
const config = require('../config')

// Spotify song download
if (!commands.find(c => c.pattern === 'spotifydl')) {
    cmd({
        pattern: 'spotifydl',
        desc: 'Download song from Spotify',
        category: 'download',
        react: '🎵',
        filename: __filename
    }, async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply('Usage: .spotifydl <Spotify URL>')
            
            reply('⏳ Downloading from Spotify... please wait')
            
            const url = `https://api.ryzendesu.vip/api/downloader/spotify?url=${encodeURIComponent(q)}`
            const data = await fetchJson(url)
            
            if (!data || !data.result || !data.result.download_url) {
                return reply('❌ Failed to download from Spotify.')
            }
            
            const audioUrl = data.result.download_url
            const title = data.result.title || 'song'
            const artist = data.result.artist || ''
            
            await conn.sendMessage(from, {
                audio: await getBuffer(audioUrl),
                mimetype: 'audio/mpeg',
                ptt: false,
                caption: `*${title}*\n${artist}\n\n✅ Downloaded from Spotify`
            }, { quoted: mek })
            
        } catch (e) {
            console.error('Spotify download error:', e)
            reply('❌ Spotify download failed.')
        }
    })
}

// YouTube audio/music download
if (!commands.find(c => c.pattern === 'ytaudio')) {
    cmd({
        pattern: 'ytaudio',
        desc: 'Download audio from YouTube',
        category: 'download',
        react: '🎶',
        filename: __filename
    }, async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply('Usage: .ytaudio <YouTube URL or song name>')
            
            reply('⏳ Downloading audio... please wait')
            
            // Try to get audio from YouTube
            const url = `https://api.ryzendesu.vip/api/downloader/youtube?url=${encodeURIComponent(q)}`
            const data = await fetchJson(url)
            
            if (!data || !data.result) {
                return reply('❌ Failed to download audio from YouTube.')
            }
            
            // Extract audio URL if available
            let audioUrl = data.result.audio_url || data.result.download_url
            if (!audioUrl) return reply('❌ Could not extract audio.')
            
            const title = data.result.title || 'audio'
            
            await conn.sendMessage(from, {
                audio: await getBuffer(audioUrl),
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: mek })
            
        } catch (e) {
            console.error('YouTube audio download error:', e)
            reply('❌ YouTube audio download failed.')
        }
    })
}

// SoundCloud download
if (!commands.find(c => c.pattern === 'soundcloud')) {
    cmd({
        pattern: 'soundcloud',
        desc: 'Download audio from SoundCloud',
        category: 'download',
        react: '☁️',
        filename: __filename
    }, async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply('Usage: .soundcloud <SoundCloud URL>')
            
            reply('⏳ Downloading from SoundCloud... please wait')
            
            const url = `https://api.ryzendesu.vip/api/downloader/soundcloud?url=${encodeURIComponent(q)}`
            const data = await fetchJson(url)
            
            if (!data || !data.result || !data.result.download_url) {
                return reply('❌ Failed to download from SoundCloud.')
            }
            
            const audioUrl = data.result.download_url
            const title = data.result.title || 'audio'
            
            await conn.sendMessage(from, {
                audio: await getBuffer(audioUrl),
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: mek })
            
        } catch (e) {
            console.error('SoundCloud download error:', e)
            reply('❌ SoundCloud download failed.')
        }
    })
}

// Generic audio downloader
if (!commands.find(c => c.pattern === 'audiodl')) {
    cmd({
        pattern: 'audiodl',
        desc: 'Download audio from various sources',
        category: 'download',
        react: '🔊',
        filename: __filename
    }, async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply('Usage: .audiodl <audio URL>')
            
            reply('⏳ Downloading audio... please wait')
            
            const url = `https://api.ryzendesu.vip/api/downloader/generic?url=${encodeURIComponent(q)}`
            const data = await fetchJson(url)
            
            if (!data || !data.result) {
                return reply('❌ Failed to download audio.')
            }
            
            const audioUrl = data.result.url || data.result.download_url
            if (!audioUrl) return reply('❌ Could not extract audio.')
            
            await conn.sendMessage(from, {
                audio: await getBuffer(audioUrl),
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: mek })
            
        } catch (e) {
            console.error('Generic audio download error:', e)
            reply('❌ Audio download failed.')
        }
    })
}

// MP3 search and download
if (!commands.find(c => c.pattern === 'mp3search')) {
    cmd({
        pattern: 'mp3search',
        desc: 'Search and download MP3 songs',
        category: 'download',
        react: '🎵',
        filename: __filename
    }, async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply('Usage: .mp3search <song name>')
            
            reply('⏳ Searching for song... please wait')
            
            // Search for the song
            const url = `https://api.ryzendesu.vip/api/search/mp3?query=${encodeURIComponent(q)}`
            const data = await fetchJson(url)
            
            if (!data || !data.result || data.result.length === 0) {
                return reply('❌ No songs found for: ' + q)
            }
            
            const song = data.result[0]
            const downloadUrl = song.url || song.download_url
            
            if (!downloadUrl) return reply('❌ Could not find download link.')
            
            await conn.sendMessage(from, {
                audio: await getBuffer(downloadUrl),
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: mek })
            
        } catch (e) {
            console.error('MP3 search error:', e)
            reply('❌ Song search/download failed.')
        }
    })
}

// Music downloader (flexible)
if (!commands.find(c => c.pattern === 'music')) {
    cmd({
        pattern: 'music',
        desc: 'Download music from various platforms',
        category: 'download',
        react: '🎼',
        filename: __filename
    }, async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply('Usage: .music <URL or song name>')
            
            reply('⏳ Finding music... please wait')
            
            // Check if it's a URL or song name
            const isUrl = q.startsWith('http')
            
            let audioUrl, title
            
            if (isUrl) {
                // It's a URL - try to download
                const url = `https://api.ryzendesu.vip/api/downloader/generic?url=${encodeURIComponent(q)}`
                const data = await fetchJson(url)
                
                if (!data || !data.result) {
                    return reply('❌ Failed to download music from URL.')
                }
                
                audioUrl = data.result.url || data.result.download_url
                title = data.result.title || 'music'
            } else {
                // It's a song name - search for it
                const url = `https://api.ryzendesu.vip/api/search/mp3?query=${encodeURIComponent(q)}`
                const data = await fetchJson(url)
                
                if (!data || !data.result || data.result.length === 0) {
                    return reply('❌ No music found for: ' + q)
                }
                
                audioUrl = data.result[0].url || data.result[0].download_url
                title = data.result[0].title || q
            }
            
            if (!audioUrl) return reply('❌ Could not get audio download link.')
            
            await conn.sendMessage(from, {
                audio: await getBuffer(audioUrl),
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: mek })
            
        } catch (e) {
            console.error('Music downloader error:', e)
            reply('❌ Music download failed. Try another source.')
        }
    })
}

module.exports = {}

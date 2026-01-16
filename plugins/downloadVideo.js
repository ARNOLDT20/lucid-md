const { cmd, commands } = require('../command')
const { fetchJson, getBuffer } = require('../lib/functions')
const axios = require('axios')
const config = require('../config')

// YouTube video download
if (!commands.find(c => c.pattern === 'ytdl')) {
    cmd({
        pattern: 'ytdl',
        desc: 'Download video from YouTube',
        category: 'download',
        react: '📥',
        filename: __filename
    }, async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply('Usage: .ytdl <YouTube URL>')

            reply('⏳ Downloading video... please wait')

            // Try using a third-party API for YouTube download
            const url = `https://api.ryzendesu.vip/api/downloader/youtube?url=${encodeURIComponent(q)}`
            const data = await fetchJson(url)

            if (!data || !data.result || !data.result.download_url) {
                return reply('❌ Failed to download. Make sure the URL is valid.')
            }

            const videoUrl = data.result.download_url
            const title = data.result.title || 'video'

            // Send video
            await conn.sendMessage(from, {
                video: await getBuffer(videoUrl),
                caption: `*${title}*\n\n✅ Downloaded via YouTube`
            }, { quoted: mek })

        } catch (e) {
            console.error('YouTube download error:', e)
            reply('❌ YouTube download failed. Try another URL.')
        }
    })
}

// Facebook video download
if (!commands.find(c => c.pattern === 'fbdl')) {
    cmd({
        pattern: 'fbdl',
        desc: 'Download video from Facebook',
        category: 'download',
        react: '👍',
        filename: __filename
    }, async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply('Usage: .fbdl <Facebook URL>')

            reply('⏳ Downloading Facebook video... please wait')

            // Use a third-party API for Facebook downloads
            const url = `https://api.ryzendesu.vip/api/downloader/fbdown?url=${encodeURIComponent(q)}`
            const data = await fetchJson(url)

            if (!data || !data.result) {
                return reply('❌ Failed to download Facebook video.')
            }

            const videoUrl = data.result.url || data.result[0]?.url
            if (!videoUrl) return reply('❌ Could not find video in response.')

            await conn.sendMessage(from, {
                video: await getBuffer(videoUrl),
                caption: '✅ Downloaded from Facebook'
            }, { quoted: mek })

        } catch (e) {
            console.error('Facebook download error:', e)
            reply('❌ Facebook download failed.')
        }
    })
}

// Instagram video/photo download
if (!commands.find(c => c.pattern === 'igdl')) {
    cmd({
        pattern: 'igdl',
        desc: 'Download video or photo from Instagram',
        category: 'download',
        react: '📷',
        filename: __filename
    }, async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply('Usage: .igdl <Instagram URL>')

            reply('⏳ Downloading from Instagram... please wait')

            const url = `https://api.ryzendesu.vip/api/downloader/instagram?url=${encodeURIComponent(q)}`
            const data = await fetchJson(url)

            if (!data || !data.result) {
                return reply('❌ Failed to download Instagram content.')
            }

            const mediaUrl = data.result.url || data.result[0]?.url
            if (!mediaUrl) return reply('❌ Could not find media.')

            // Determine if it's a video or image
            const isVideo = mediaUrl.includes('.mp4') || data.result.type === 'video'

            if (isVideo) {
                await conn.sendMessage(from, {
                    video: await getBuffer(mediaUrl),
                    caption: '✅ Downloaded from Instagram'
                }, { quoted: mek })
            } else {
                await conn.sendMessage(from, {
                    image: await getBuffer(mediaUrl),
                    caption: '✅ Downloaded from Instagram'
                }, { quoted: mek })
            }

        } catch (e) {
            console.error('Instagram download error:', e)
            reply('❌ Instagram download failed.')
        }
    })
}

// TikTok video download
if (!commands.find(c => c.pattern === 'tiktok')) {
    cmd({
        pattern: 'tiktok',
        desc: 'Download video from TikTok',
        category: 'download',
        react: '🎵',
        filename: __filename
    }, async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply('Usage: .tiktok <TikTok URL>')

            reply('⏳ Downloading TikTok video... please wait')

            const url = `https://api.ryzendesu.vip/api/downloader/tiktok?url=${encodeURIComponent(q)}`
            const data = await fetchJson(url)

            if (!data || !data.result || !data.result.video) {
                return reply('❌ Failed to download TikTok video.')
            }

            await conn.sendMessage(from, {
                video: await getBuffer(data.result.video),
                caption: `${data.result.title ? '*' + data.result.title + '*\n\n' : ''}✅ Downloaded from TikTok`
            }, { quoted: mek })

        } catch (e) {
            console.error('TikTok download error:', e)
            reply('❌ TikTok download failed.')
        }
    })
}

// Generic video downloader
if (!commands.find(c => c.pattern === 'videodl')) {
    cmd({
        pattern: 'videodl',
        desc: 'Download video from various sources',
        category: 'download',
        react: '🎬',
        filename: __filename
    }, async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply('Usage: .videodl <video URL>')

            reply('⏳ Downloading video... please wait')

            // Try generic video download
            const url = `https://api.ryzendesu.vip/api/downloader/generic?url=${encodeURIComponent(q)}`
            const data = await fetchJson(url)

            if (!data || !data.result) {
                return reply('❌ Failed to download video. Make sure URL is valid.')
            }

            const videoUrl = data.result.url || data.result.download_url
            if (!videoUrl) return reply('❌ Could not extract video.')

            await conn.sendMessage(from, {
                video: await getBuffer(videoUrl),
                caption: '✅ Video downloaded successfully'
            }, { quoted: mek })

        } catch (e) {
            console.error('Generic video download error:', e)
            reply('❌ Video download failed.')
        }
    })
}

module.exports = {}

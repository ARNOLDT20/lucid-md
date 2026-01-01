const { cmd, commands } = require('../command')
const { fetchJson } = require('../lib/functions')
const config = require('../config')

const textCommands = ['ai', 'gpt', 'chatgpt', 'ask', 'bard', 'gemini', 'voiceai', 'translate', 'summarize', 'rewrite', 'code', 'debug', 'explain']
const imageCommands = ['imagine', 'dalle', 'draw', 'imageai']

function makeTextHandler(name) {
    return async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply(`Usage: .${name} <your question>`)
            // use the same simple third-party endpoint as other ai plugin
            const url = `https://chatgptforprabath-md.vercel.app/api/gptv1?q=${encodeURIComponent(q)}`
            const data = await fetchJson(url)
            if (!data) return reply('No response from AI service')
            const text = data.data || data.response || JSON.stringify(data)
            // if forwarding is enabled, attach context meta similar to menu/ping
            if (config.FORWARD_PING_ON_DEPLOY || config.FORWARD_MENU_ON_DEPLOY) {
                const CONTEXT_META = {
                    isForwarded: true,
                    forwardingScore: 999,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363420222821450@newsletter",
                        newsletterName: "@T20_starboy",
                        serverMessageId: -1
                    },
                    externalAdReply: {
                        title: "☢️ VIPER MD ☢️",
                        body: "👑 Royal Command Menu",
                        thumbnailUrl: "https://files.catbox.moe/82aewo.png",
                        sourceUrl: "https://whatsapp.com/channel/0029Vb6H6jF9hXEzZFlD6F3d",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
                return conn.sendMessage(from, Object.assign({ text }, { contextInfo: CONTEXT_META }), { quoted: mek })
            }
            reply(text)
        } catch (e) {
            console.error('AI command error:', e)
            reply('AI service error')
        }
    }
}

function makeImageHandler(name) {
    return async (conn, mek, m, { from, reply, q }) => {
        try {
            if (!q || q.trim().length === 0) return reply(`Usage: .${name} <prompt>`)
            // Image generation not provided by default; inform user
            reply('Image generation is not available in this deployment. Try the text AI commands like .ai for descriptions.')
        } catch (e) {
            console.error('AI image command error:', e)
            reply('Image AI service error')
        }
    }
}

textCommands.forEach(name => {
    if (!commands.find(c => c.pattern === name)) {
        cmd({ pattern: name, desc: `${name} AI command`, category: 'ai', react: '🤖', filename: __filename }, makeTextHandler(name))
    }
})

imageCommands.forEach(name => {
    if (!commands.find(c => c.pattern === name)) {
        cmd({ pattern: name, desc: `${name} image AI command`, category: 'ai', react: '🖼️', filename: __filename }, makeImageHandler(name))
    }
})

module.exports = {}

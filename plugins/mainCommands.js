const { cmd, commands } = require('../command')
const config = require('../config')
const { runtime } = require('../lib/functions')

const EXTERNAL_AD_REPLY = {
    title: "☢️ VIPER MD ☢️",
    body: "👑 Royal Command Menu",
    thumbnailUrl: "https://files.catbox.moe/82aewo.png",
    sourceUrl: "https://whatsapp.com/channel/0029Vb6H6jF9hXEzZFlD6F3d",
    mediaType: 1,
    renderLargerThumbnail: true
}
const CONTEXT_META = Object.assign({
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
        newsletterJid: "120363420222821450@newsletter",
        newsletterName: "@T20_starboy",
        serverMessageId: -1
    }
}, { externalAdReply: EXTERNAL_AD_REPLY })

// alive
if (!commands.find(c => c.pattern === 'alive')) cmd({ pattern: 'alive', desc: 'Show alive message', category: 'main', react: '✅', filename: __filename }, async (conn, mek, m, { from, reply }) => {
    try {
        const caption = config.ALIVE_MSG || 'I am alive'
        await conn.sendMessage(from, Object.assign({ image: { url: config.ALIVE_IMG || config.MENU_THUMB }, caption }, config.FORWARD_MENU_ON_DEPLOY ? { contextInfo: CONTEXT_META } : {}), { quoted: mek })
    } catch (e) { reply('Failed to send alive message') }
})


// runtime / uptime
if (!commands.find(c => c.pattern === 'runtime')) cmd({ pattern: 'runtime', desc: 'Show runtime', category: 'main', react: '⏳', filename: __filename }, async (conn, mek, m, { reply }) => {
    if (config.FORWARD_MENU_ON_DEPLOY) conn.sendMessage(mek.key.remoteJid, Object.assign({ text: `Uptime: ${runtime(process.uptime())}` }, { contextInfo: CONTEXT_META }), { quoted: mek })
    else reply(`Uptime: ${runtime(process.uptime())}`)
})
if (!commands.find(c => c.pattern === 'uptime')) cmd({ pattern: 'uptime', desc: 'Show uptime', category: 'main', react: '⏱️', filename: __filename }, async (conn, mek, m, { reply }) => {
    if (config.FORWARD_MENU_ON_DEPLOY) conn.sendMessage(mek.key.remoteJid, Object.assign({ text: `Uptime: ${runtime(process.uptime())}` }, { contextInfo: CONTEXT_META }), { quoted: mek })
    else reply(`Uptime: ${runtime(process.uptime())}`)
})

// speed
if (!commands.find(c => c.pattern === 'speed')) cmd({ pattern: 'speed', desc: 'Measure execution speed', category: 'main', react: '⚡', filename: __filename }, async (conn, mek, m, { reply }) => {
    const t0 = process.hrtime()
    const t1 = process.hrtime(t0)
    const ms = (t1[0] * 1000) + (t1[1] / 1e6)
    if (config.FORWARD_MENU_ON_DEPLOY) conn.sendMessage(mek.key.remoteJid, Object.assign({ text: `Speed: ${ms.toFixed(3)} ms` }, { contextInfo: CONTEXT_META }), { quoted: mek })
    else reply(`Speed: ${ms.toFixed(3)} ms`)
})

// status / botinfo
if (!commands.find(c => c.pattern === 'status')) cmd({ pattern: 'status', desc: 'Bot status', category: 'main', react: '📊', filename: __filename }, async (conn, mek, m, { from, reply }) => {
    try {
        const total = commands.length
        const text = `Bot Status:\nOwner: ${config.SESSION_ID || 'owner'}\nCommands: ${total}\nUptime: ${runtime(process.uptime())}`
        if (config.FORWARD_MENU_ON_DEPLOY) conn.sendMessage(from, Object.assign({ text }, { contextInfo: CONTEXT_META }), { quoted: mek })
        else reply(text)
    } catch (e) { reply('Failed to get status') }
})
if (!commands.find(c => c.pattern === 'botinfo')) cmd({ pattern: 'botinfo', desc: 'Bot information', category: 'main', react: '🤖', filename: __filename }, async (conn, mek, m, { from, reply }) => {
    if (config.FORWARD_MENU_ON_DEPLOY) conn.sendMessage(from, Object.assign({ text: `Bot Info:\nOwner: ${config.SESSION_ID || 'owner'}\nUptime: ${runtime(process.uptime())}` }, { contextInfo: CONTEXT_META }), { quoted: mek })
    else reply(`Bot Info:\nOwner: ${config.SESSION_ID || 'owner'}\nUptime: ${runtime(process.uptime())}`)
})

// repo / support / rules / terms / privacy / help
if (!commands.find(c => c.pattern === 'repo')) cmd({ pattern: 'repo', desc: 'Repository link & stats', category: 'main', react: '📦', filename: __filename }, async (conn, mek, m, { from, reply }) => {
    try {
        const { fetchJson } = require('../lib/functions')
        const repoData = await fetchJson('https://api.github.com/repos/ARNOLDT20/lucid-md').catch(() => null)

        let repoText = `
╔════════════════════════════════════════════════╗
║         ⭐ LUCID MD REPOSITORY ⭐              ║
╚════════════════════════════════════════════════╝

📦 *Repository:* https://github.com/ARNOLDT20/lucid-md

`

        if (repoData) {
            repoText += `
📊 *Repository Statistics:*
  ⭐ Stars: ${repoData.stargazers_count || 0}
  🍴 Forks: ${repoData.forks_count || 0}
  👁️ Watchers: ${repoData.watchers_count || 0}
  🐛 Open Issues: ${repoData.open_issues_count || 0}
  📝 Language: ${repoData.language || 'Not specified'}
  📅 Last Updated: ${new Date(repoData.updated_at).toLocaleDateString()}

`
        }

        repoText += `
✨ *Don't forget to:*
  ⭐ STAR the repository
  🍴 FORK the repository
  👁️ WATCH for updates
  
This helps support the project!

🔗 *Quick Links:*
  📄 Issues: https://github.com/ARNOLDT20/lucid-md/issues
  🔔 Releases: https://github.com/ARNOLDT20/lucid-md/releases
  💬 Discussions: https://github.com/ARNOLDT20/lucid-md/discussions

╔════════════════════════════════════════════════╗
║  Thank you for using LUCID MD! 🙏             ║
╚════════════════════════════════════════════════╝
`

        if (config.FORWARD_MENU_ON_DEPLOY) conn.sendMessage(from, Object.assign({ text: repoText }, { contextInfo: CONTEXT_META }), { quoted: mek })
        else reply(repoText)
    } catch (e) {
        console.error('repo command error:', e)
        reply('📦 Repository: https://github.com/ARNOLDT20/lucid-md\n\nPlease visit the link for more information!')
    }
})
if (!commands.find(c => c.pattern === 'support')) cmd({ pattern: 'support', desc: 'Support link', category: 'main', react: '🛟', filename: __filename }, async (conn, mek, m, { from, reply }) => {
    if (config.FORWARD_MENU_ON_DEPLOY) conn.sendMessage(from, Object.assign({ text: 'Support: https://t.me/your_support' }, { contextInfo: CONTEXT_META }), { quoted: mek })
    else reply('Support: https://t.me/your_support')
})
if (!commands.find(c => c.pattern === 'rules')) cmd({ pattern: 'rules', desc: 'Rules', category: 'main', react: '📜', filename: __filename }, async (conn, mek, m, { from, reply }) => {
    if (config.FORWARD_MENU_ON_DEPLOY) conn.sendMessage(from, Object.assign({ text: 'Rules: Be respectful. No spam.' }, { contextInfo: CONTEXT_META }), { quoted: mek })
    else reply('Rules: Be respectful. No spam.')
})
if (!commands.find(c => c.pattern === 'terms')) cmd({ pattern: 'terms', desc: 'Terms', category: 'main', react: '📘', filename: __filename }, async (conn, mek, m, { from, reply }) => {
    if (config.FORWARD_MENU_ON_DEPLOY) conn.sendMessage(from, Object.assign({ text: 'Terms: Use at your own risk.' }, { contextInfo: CONTEXT_META }), { quoted: mek })
    else reply('Terms: Use at your own risk.')
})
if (!commands.find(c => c.pattern === 'privacy')) cmd({ pattern: 'privacy', desc: 'Privacy policy', category: 'main', react: '🔒', filename: __filename }, async (conn, mek, m, { from, reply }) => {
    if (config.FORWARD_MENU_ON_DEPLOY) conn.sendMessage(from, Object.assign({ text: 'Privacy: No data is stored long-term by default.' }, { contextInfo: CONTEXT_META }), { quoted: mek })
    else reply('Privacy: No data is stored long-term by default.')
})
if (!commands.find(c => c.pattern === 'help')) cmd({ pattern: 'help', desc: 'Help', category: 'main', react: '🆘', filename: __filename }, async (conn, mek, m, { from, reply }) => {
    if (config.FORWARD_MENU_ON_DEPLOY) conn.sendMessage(from, Object.assign({ text: 'Send .menu or .allmenu to see available commands.' }, { contextInfo: CONTEXT_META }), { quoted: mek })
    else reply('Send .menu or .allmenu to see available commands.')
})

// owner contact details
if (!commands.find(c => c.pattern === 'owner')) cmd({ pattern: 'owner', desc: 'Get owner contact details', category: 'info', react: '👑', filename: __filename }, async (conn, mek, m, { from, reply }) => {
    try {
        console.log('[OWNER CMD] Starting owner command for:', from)

        const ownerText = `
╔════════════════════════════════════════════════╗
║           👑 BOT OWNER CONTACT 👑              ║
╚════════════════════════════════════════════════╝

📱 *Owner Information:*
  • Name: T20_starboy
  • WhatsApp: +255627417402
  • Telegram: @T20_starboy
  • GitHub: @ARNOLDT20

🔗 *Quick Links:*
  🟢 WhatsApp: https://wa.me/255627417402
  💙 Telegram: https://t.me/T20_starboy
  ⚫ GitHub: https://github.com/ARNOLDT20
  📢 Channel: https://whatsapp.com/channel/0029Vb6H6jF9hXEzZFlD6F3d

╔════════════════════════════════════════════════╗
║  Feel free to reach out for support! 🙏       ║
╚════════════════════════════════════════════════╝
`

        // Owner profile image URL
        const ownerProfileUrl = 'https://files.catbox.moe/82aewo.png'

        try {
            console.log('[OWNER CMD] Attempting to send image...')
            // Send image with caption
            const result = await conn.sendMessage(from, {
                image: { url: ownerProfileUrl },
                caption: ownerText,
                footer: 'LUCID MD BOT',
                ...(config.FORWARD_MENU_ON_DEPLOY ? { contextInfo: CONTEXT_META } : {})
            }, { quoted: mek })
            console.log('[OWNER CMD] Image sent successfully')
            return result
        } catch (imgErr) {
            console.error('[OWNER CMD] Failed to send image, error:', imgErr.message)
            console.log('[OWNER CMD] Fallback to text message...')
            // Fallback to text only
            try {
                const result = await reply(ownerText)
                console.log('[OWNER CMD] Text message sent successfully')
                return result
            } catch (textErr) {
                console.error('[OWNER CMD] Text message also failed:', textErr.message)
                throw textErr
            }
        }
    } catch (e) {
        console.error('[OWNER CMD ERROR]', e.message || e)
        try {
            await reply('👑 *Owner Contact:*\n\n📱 WhatsApp: https://wa.me/255627417402\n💬 Telegram: @T20_starboy\n🐙 GitHub: @ARNOLDT20')
        } catch (replyErr) {
            console.error('[OWNER CMD] Final reply also failed:', replyErr.message)
        }
    }
})

module.exports = {}

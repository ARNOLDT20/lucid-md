const { cmd, commands } = require('../command')
const config = require('../config')

const ROYAL_HEADER = `
╔══════════════════════════════════════════╗
║   👑 LUCID MD - ROYAL COMMAND MENU 👑    ║
║                                          ║
║        🤖 Advanced WhatsApp Bot          ║
╚══════════════════════════════════════════╝
`

const CONTEXT_META = {
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
        newsletterJid: "120363420222821450@newsletter",
        newsletterName: "@T20_starboy",
        serverMessageId: -1
    },
    externalAdReply: {
        title: "👑 LUCID MD MENU 👑",
        body: "Royal Command Collection",
        thumbnailUrl: "https://files.catbox.moe/82aewo.png",
        sourceUrl: "https://whatsapp.com/channel/0029Vb6H6jF9hXEzZFlD6F3d",
        mediaType: 1,
        renderLargerThumbnail: true
    }
}

// Main menu
cmd({
    pattern: 'menu',
    desc: 'Display command menu',
    category: 'main',
    react: '📂',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Group commands by category
        const categories = {}
        const categoryEmojis = {
            'main': '🤖',
            'download': '📥',
            'group': '👥',
            'ai': '🧠',
            'tools': '🔧',
            'owner': '👑',
            'misc': '⚙️',
            'other': '📝'
        }

        // Filter and organize commands by category
        commands.forEach(cmd => {
            if (cmd.dontAddCommandList || cmd.pattern === 'menu' || cmd.pattern === 'allmenu' || cmd.pattern === 'download') return

            const category = cmd.category || 'misc'
            if (!categories[category]) categories[category] = []
            categories[category].push(cmd)
        })

        // Build menu dynamically
        let menu = `${ROYAL_HEADER}\n`

        Object.keys(categories).sort().forEach(cat => {
            const cmds = categories[cat]
            if (cmds.length === 0) return

            const emoji = categoryEmojis[cat] || '📋'
            menu += `\n╔═══ ${emoji} ${cat.toUpperCase()} ═══╗\n`

            cmds.slice(0, 15).forEach(c => {
                const desc = c.desc || 'No description'
                const padding = ' '.repeat(Math.max(0, 12 - c.pattern.length))
                menu += `║ .${c.pattern}${padding} → ${desc.substring(0, 32)}\n`
            })

            menu += `╚${'═'.repeat(39)}╝\n`
        })

        menu += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
        menu += `✨ *Tip:* Use .allmenu for detailed menu\n`
        menu += `📊 *Total Commands:* ${commands.filter(c => !c.dontAddCommandList).length}\n`
        menu += `🔥 *Status:* Active & Online\n`
        menu += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
        menu += `Made with ❤️ by *T20_starboy*\n`
        menu += `Version 1.0.0 - Lucid MD`

        await conn.sendMessage(from, {
            text: menu
        }, { quoted: mek })

    } catch (e) {
        console.error('Menu error:', e)
        reply('❌ Failed to display menu')
    }
})

// Detailed menu with images
cmd({
    pattern: 'allmenu',
    desc: 'Display full menu with image',
    category: 'main',
    react: '👑',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Group commands by category
        const categories = {}
        const categoryEmojis = {
            'main': '🤖',
            'download': '📥',
            'group': '👥',
            'ai': '🧠',
            'tools': '🔧',
            'owner': '👑',
            'misc': '⚙️',
            'other': '📝'
        }

        // Filter and organize all commands
        commands.forEach(cmd => {
            if (cmd.dontAddCommandList || cmd.pattern === 'allmenu') return

            const category = cmd.category || 'misc'
            if (!categories[category]) categories[category] = []
            categories[category].push(cmd)
        })

        // Build detailed menu dynamically
        let menu = `${ROYAL_HEADER}\n\n`

        Object.keys(categories).sort().forEach(cat => {
            const cmds = categories[cat]
            if (cmds.length === 0) return

            const emoji = categoryEmojis[cat] || '📋'
            menu += `╭─${'━'.repeat(36)}─╮\n`
            menu += `│  ${emoji} ${cat.toUpperCase().padEnd(31)} ${emoji}\n`
            menu += `╰─${'━'.repeat(36)}─╯\n\n`

            cmds.forEach((c, idx) => {
                const symbol = idx === cmds.length - 1 ? '└' : '├'
                menu += `  ${symbol}─ .${c.pattern} - ${c.desc || 'No description'}\n`
            })

            menu += '\n'
        })

        menu += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
        menu += `✨ *QUICK TIPS* ✨\n\n`
        menu += `🔹 Type .menu for quick view\n`
        menu += `🔹 Use .download to see download commands\n`
        menu += `🔹 Commands take time to load\n`
        menu += `🔹 All links are auto-generated\n`
        menu += `🔹 Supports multiple platforms\n\n`
        menu += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
        menu += `🌟 *BOT STATISTICS* 🌟\n`
        menu += `📊 Total Commands: ${commands.filter(c => !c.dontAddCommandList).length}\n`
        menu += `🎯 Categories: ${Object.keys(categories).length}\n`
        menu += `🔥 Status: Active & Online\n`
        menu += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
        menu += `Made with ❤️ by *T20_starboy*\n`
        menu += `Version 1.0.0 - Lucid MD`

        await conn.sendMessage(from, {
            image: { url: config.MENU_THUMB || 'https://files.catbox.moe/82aewo.png' },
            caption: menu
        }, { quoted: mek })

    } catch (e) {
        console.error('All menu error:', e)
        reply('❌ Failed to display full menu')
    }
})

// Download menu
cmd({
    pattern: 'download',
    desc: 'Show download commands',
    category: 'download',
    react: '📥',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Get only download commands
        const downloadCmds = commands.filter(c => c.category === 'download' && !c.dontAddCommandList)

        let menu = `
╔══════════════════════════════════════╗
║    📥 DOWNLOAD COMMANDS MENU 📥      ║
╚══════════════════════════════════════╝\n\n`

        if (downloadCmds.length === 0) {
            return reply('❌ No download commands found. Try .menu for available commands.')
        }

        // Separate by subcategory
        const videoCommands = downloadCmds.filter(c => c.pattern.includes('video') || c.pattern.includes('ytdl') || c.pattern.includes('fb') || c.pattern.includes('ig') || c.pattern.includes('tiktok'))
        const audioCommands = downloadCmds.filter(c => !c.pattern.includes('video') && (c.pattern.includes('audio') || c.pattern.includes('spotify') || c.pattern.includes('sound') || c.pattern.includes('song') || c.pattern.includes('music') || c.pattern.includes('play') || c.pattern.includes('mp3')))
        const otherCommands = downloadCmds.filter(c => !videoCommands.includes(c) && !audioCommands.includes(c))

        if (videoCommands.length > 0) {
            menu += `🎬 *VIDEO DOWNLOADS*\n`
            videoCommands.forEach((c, idx) => {
                const symbol = idx === videoCommands.length - 1 && audioCommands.length === 0 && otherCommands.length === 0 ? '└' : '├'
                menu += `${symbol}─ .${c.pattern} → ${c.desc}\n`
            })
            menu += '\n'
        }

        if (audioCommands.length > 0) {
            menu += `🎵 *AUDIO/MUSIC DOWNLOADS*\n`
            audioCommands.forEach((c, idx) => {
                const symbol = idx === audioCommands.length - 1 && otherCommands.length === 0 ? '└' : '├'
                menu += `${symbol}─ .${c.pattern} → ${c.desc}\n`
            })
            menu += '\n'
        }

        if (otherCommands.length > 0) {
            menu += `📝 *OTHER DOWNLOAD TOOLS*\n`
            otherCommands.forEach((c, idx) => {
                const symbol = idx === otherCommands.length - 1 ? '└' : '├'
                menu += `${symbol}─ .${c.pattern} → ${c.desc}\n`
            })
            menu += '\n'
        }

        menu += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
        menu += `💡 *TIPS:*\n`
        menu += `🎵 Downloads take 10-30 seconds\n`
        menu += `🌟 Use .dmusic for music\n`
        menu += `🔎 Try .songsearch if not found\n`
        menu += `✅ Supports: YouTube, Spotify, TikTok\n`

        reply(menu)

    } catch (e) {
        console.error('Download menu error:', e)
        reply('❌ Failed to display download menu')
    }
})

module.exports = {}

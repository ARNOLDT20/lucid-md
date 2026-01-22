const { cmd, commands } = require('../command')
const config = require('../config')

// Store command help data
const commandHelp = {}
commands.forEach(c => {
    if (!c.dontAddCommandList && c.pattern && c.desc) {
        commandHelp[c.pattern] = {
            pattern: c.pattern,
            desc: c.desc,
            category: c.category || 'misc'
        }
    }
})

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

// Main menu with buttons
cmd({
    pattern: 'menu',
    desc: 'Display command menu',
    category: 'main',
    react: '📂',
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup }) => {
    try {
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

        // Get unique categories
        const categories = {}
        commands.forEach(cmd => {
            if (!cmd.dontAddCommandList && cmd.pattern !== 'menu' && cmd.pattern !== 'allmenu' && cmd.pattern !== 'download') {
                const category = cmd.category || 'misc'
                if (!categories[category]) categories[category] = 0
                categories[category]++
            }
        })

        let menuText = `${ROYAL_HEADER}\n`
        menuText += `✨ *Select a category to explore:*\n\n`

        const sortedCategories = Object.keys(categories).sort()

        // For groups, send text-based menu (buttons don't work well in groups)
        if (isGroup) {
            let groupMenu = menuText + `*Available Categories:*\n\n`
            sortedCategories.forEach(cat => {
                groupMenu += `🔹 *${categoryEmojis[cat] || '📋'} ${cat.toUpperCase()}* (${categories[cat]} commands)\n`
                groupMenu += `   Type: .help ${cat}\n\n`
            })
            groupMenu += `Or type: .allmenu (for all commands with descriptions)\n`
            groupMenu += `Or type: .help (for help system)`
            return await reply(groupMenu)
        }

        // For PM, try buttons first
        const buttons = sortedCategories.map((cat, idx) => ({
            buttonId: `cat_${cat}`,
            buttonText: { displayText: `${categoryEmojis[cat] || '📋'} ${cat.charAt(0).toUpperCase() + cat.slice(1)} (${categories[cat]})` },
            type: 1
        }))

        buttons.push({
            buttonId: 'menu_help',
            buttonText: { displayText: '❓ Show Descriptions' },
            type: 1
        })

        try {
            await conn.sendMessage(from, {
                text: menuText,
                buttons: buttons,
                headerType: 1
            }, { quoted: mek })
        } catch (e) {
            // Fallback to text menu if buttons not supported
            let fallbackMenu = menuText + '\n*Available Categories:*\n'
            sortedCategories.forEach(cat => {
                fallbackMenu += `🔹 ${categoryEmojis[cat] || '📋'} ${cat} (${categories[cat]} commands)\n`
            })
            fallbackMenu += `\nType .help <category> for commands`
            await reply(fallbackMenu)
        }

    } catch (e) {
        console.error('Menu error:', e)
        await reply('❌ Failed to display menu')
    }
})

// All commands with descriptions
cmd({
    pattern: 'allmenu',
    desc: 'Display full menu with descriptions',
    category: 'main',
    react: '👑',
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup }) => {
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

        // Build detailed menu with descriptions
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
                menu += `${symbol}─ .${c.pattern} - ${c.desc || 'No description'}\n`
            })

            menu += '\n'
        })

        menu += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
        menu += `📊 Total Commands: ${commands.filter(c => !c.dontAddCommandList).length}\n`
        menu += `🎯 Categories: ${Object.keys(categories).length}\n`
        menu += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
        menu += `Made with ❤️ by *T20_starboy*\n`
        menu += `Version 1.0.0 - Lucid MD`

        await reply(menu)

    } catch (e) {
        console.error('All menu error:', e)
        await reply('❌ Failed to display full menu')
    }
})

// Download menu with buttons
cmd({
    pattern: 'download',
    desc: 'Show download commands',
    category: 'download',
    react: '📥',
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup }) => {
    try {
        // Get only download commands
        const downloadCmds = commands.filter(c => c.category === 'download' && !c.dontAddCommandList)

        if (downloadCmds.length === 0) {
            return await reply('❌ No download commands found. Try .menu for available commands.')
        }

        // Separate by subcategory
        const videoCommands = downloadCmds.filter(c => c.pattern.includes('video') || c.pattern.includes('ytdl') || c.pattern.includes('fb') || c.pattern.includes('ig') || c.pattern.includes('tiktok'))
        const audioCommands = downloadCmds.filter(c => !c.pattern.includes('video') && (c.pattern.includes('audio') || c.pattern.includes('spotify') || c.pattern.includes('sound') || c.pattern.includes('song') || c.pattern.includes('music') || c.pattern.includes('play') || c.pattern.includes('mp3')))
        const otherCommands = downloadCmds.filter(c => !videoCommands.includes(c) && !audioCommands.includes(c))

        let menuText = `📥 *DOWNLOAD COMMANDS MENU* 📥\n\n`

        // For groups, always use text menu
        if (isGroup) {
            let groupMenu = menuText + `*Available Download Commands:*\n\n`

            if (videoCommands.length > 0) {
                groupMenu += `🎬 *VIDEO DOWNLOADS* (${videoCommands.length})\n`
                videoCommands.forEach(c => {
                    groupMenu += `├─ .${c.pattern}\n`
                })
                groupMenu += '\n'
            }

            if (audioCommands.length > 0) {
                groupMenu += `🎵 *AUDIO/MUSIC* (${audioCommands.length})\n`
                audioCommands.forEach(c => {
                    groupMenu += `├─ .${c.pattern}\n`
                })
                groupMenu += '\n'
            }

            if (otherCommands.length > 0) {
                groupMenu += `📝 *OTHER TOOLS* (${otherCommands.length})\n`
                otherCommands.forEach(c => {
                    groupMenu += `└─ .${c.pattern}\n`
                })
                groupMenu += '\n'
            }

            groupMenu += `\n💡 Use .help download for descriptions`
            return await reply(groupMenu)
        }

        // For PM, try buttons first
        menuText += `Select a download type:\n\n`

        const buttons = []

        if (videoCommands.length > 0) {
            buttons.push({
                buttonId: 'dlcat_video',
                buttonText: { displayText: `🎬 VIDEO DOWNLOADS (${videoCommands.length})` },
                type: 1
            })
        }

        if (audioCommands.length > 0) {
            buttons.push({
                buttonId: 'dlcat_audio',
                buttonText: { displayText: `🎵 AUDIO/MUSIC (${audioCommands.length})` },
                type: 1
            })
        }

        if (otherCommands.length > 0) {
            buttons.push({
                buttonId: 'dlcat_other',
                buttonText: { displayText: `📝 OTHER TOOLS (${otherCommands.length})` },
                type: 1
            })
        }

        try {
            await conn.sendMessage(from, {
                text: menuText,
                buttons: buttons,
                headerType: 1
            }, { quoted: mek })
        } catch (e) {
            // Fallback to text menu
            let fallbackMenu = menuText

            if (videoCommands.length > 0) {
                fallbackMenu += `🎬 *VIDEO DOWNLOADS*\n`
                videoCommands.forEach(c => {
                    fallbackMenu += `├─ .${c.pattern}\n`
                })
                fallbackMenu += '\n'
            }

            if (audioCommands.length > 0) {
                fallbackMenu += `🎵 *AUDIO/MUSIC DOWNLOADS*\n`
                audioCommands.forEach(c => {
                    fallbackMenu += `├─ .${c.pattern}\n`
                })
                fallbackMenu += '\n'
            }

            if (otherCommands.length > 0) {
                fallbackMenu += `📝 *OTHER DOWNLOAD TOOLS*\n`
                otherCommands.forEach(c => {
                    fallbackMenu += `└─ .${c.pattern}\n`
                })
            }

            await reply(fallbackMenu)
        }

    } catch (e) {
        console.error('Download menu error:', e)
        await reply('❌ Failed to display download menu')
    }
})

// Help command to show descriptions
cmd({
    pattern: 'help',
    desc: 'Show command descriptions',
    category: 'main',
    react: '❓',
    filename: __filename
}, async (conn, mek, m, { from, reply, args, isGroup }) => {
    try {
        if (args.length === 0) {
            // Show help overview
            let helpText = `${ROYAL_HEADER}\n\n`
            helpText += `*📖 HELP SYSTEM*\n\n`
            helpText += `Use: .help <category>\n\n`
            helpText += `*Available categories:*\n`
            helpText += `🤖 main\n`
            helpText += `📥 download\n`
            helpText += `👥 group\n`
            helpText += `🧠 ai\n`
            helpText += `🔧 tools\n`
            helpText += `👑 owner\n`
            helpText += `⚙️ misc\n\n`
            helpText += `Or use: .help <command_name>\n\n`
            helpText += `Example: .help menu`
            return await reply(helpText)
        }

        const searchTerm = args[0].toLowerCase()

        // Search by command name
        if (commandHelp[searchTerm]) {
            const cmd = commandHelp[searchTerm]
            let helpMsg = `${ROYAL_HEADER}\n\n`
            helpMsg += `*Command:* .${cmd.pattern}\n`
            helpMsg += `*Category:* ${cmd.category}\n`
            helpMsg += `*Description:* ${cmd.desc}\n\n`
            helpMsg += `Use this command by typing: .*${cmd.pattern}*`
            return await reply(helpMsg)
        }

        // Search by category
        const categoryCommands = Object.values(commandHelp).filter(c => c.category === searchTerm)
        if (categoryCommands.length > 0) {
            let helpMsg = `${ROYAL_HEADER}\n\n`
            helpMsg += `*${searchTerm.toUpperCase()} COMMANDS*\n\n`
            categoryCommands.forEach((cmd, idx) => {
                const symbol = idx === categoryCommands.length - 1 ? '└' : '├'
                helpMsg += `${symbol}─ .${cmd.pattern} → ${cmd.desc}\n`
            })
            return await reply(helpMsg)
        }

        await reply(`❌ Command or category "*${searchTerm}*" not found.\n\nTry: .help`)

    } catch (e) {
        console.error('Help error:', e)
        await reply('❌ Failed to display help')
    }
})

module.exports = {}

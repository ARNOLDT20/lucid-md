const { cmd, commands } = require('../command')
const config = require('../config')

/* =======================
   COMMAND HELP STORAGE
======================= */
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

/* =======================
   FORWARD + THUMBNAIL META
======================= */
const CONTEXT_META = {
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
        newsletterJid: "120363420222821450@newsletter",
        newsletterName: "@T20_starboy",
        serverMessageId: -1
    },
    externalAdReply: {
        title: "👑 LUCID MD",
        body: "Clean & Condensed Command Menu",
        thumbnailUrl: "https://files.catbox.moe/sz8lsb.png",
        sourceUrl: "https://whatsapp.com/channel/0029Vb6H6jF9hXEzZFlD6F3d",
        mediaType: 1,
        renderLargerThumbnail: true
    }
}

/* =======================
   CATEGORY EMOJIS
======================= */
const categoryEmojis = {
    main: '🤖',
    download: '📥',
    group: '👥',
    ai: '🧠',
    tools: '🔧',
    owner: '👑',
    misc: '⚙️',
    other: '📝'
}

/* =======================
   MENU COMMAND
======================= */
cmd({
    pattern: 'menu',
    desc: 'Show command menu',
    category: 'main',
    react: '📂',
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const categories = {}

        commands.forEach(c => {
            if (!c.dontAddCommandList && c.pattern !== 'menu' && c.pattern !== 'allmenu') {
                const cat = c.category || 'misc'
                if (!categories[cat]) categories[cat] = 0
                categories[cat]++
            }
        })

        const sorted = Object.keys(categories).sort()

        let menuText = `👑 *LUCID MD COMMAND MENU*

📂 *Categories*
`

        sorted.forEach(cat => {
            menuText += `• ${categoryEmojis[cat] || '📁'} *${cat}* (${categories[cat]})\n`
        })

        menuText += `
━━━━━━━━━━━━━━
📌 *Usage*
• .help <category>
• .help <command>

⚡ *Quick*
• .allmenu
• .alive
• .repo
━━━━━━━━━━━━━━

✨ Made with ❤️ by *T20_starboy*
`

        await conn.sendMessage(
            from,
            { text: menuText, contextInfo: CONTEXT_META },
            { quoted: mek }
        )

    } catch (e) {
        console.error('[MENU ERROR]', e)
    }
})

/* =======================
   ALL MENU (FULL LIST)
======================= */
cmd({
    pattern: 'allmenu',
    desc: 'Show all commands',
    category: 'main',
    react: '👑',
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const categories = {}

        commands.forEach(c => {
            if (c.dontAddCommandList || c.pattern === 'allmenu') return
            const cat = c.category || 'misc'
            if (!categories[cat]) categories[cat] = []
            categories[cat].push(c)
        })

        let text = `👑 *LUCID MD – ALL COMMANDS*\n\n`

        Object.keys(categories).sort().forEach(cat => {
            text += `${categoryEmojis[cat] || '📁'} *${cat.toUpperCase()}* (${categories[cat].length})\n`
            categories[cat].forEach(c => {
                text += `  • .${c.pattern} — ${c.desc}\n`
            })
            text += '\n'
        })

        text += `━━━━━━━━━━━━━━
📊 Total: ${Object.values(categories).reduce((a, b) => a + b.length, 0)} commands
✨ By *T20_starboy*
`

        await conn.sendMessage(
            from,
            { text, contextInfo: CONTEXT_META },
            { quoted: mek }
        )

    } catch (e) {
        console.error('[ALLMENU ERROR]', e)
    }
})

/* =======================
   HELP COMMAND
======================= */
cmd({
    pattern: 'help',
    desc: 'Get help for commands',
    category: 'main',
    react: '❓',
    filename: __filename
}, async (conn, mek, m, { from, args }) => {
    try {
        if (!args[0]) {
            let helpText = `📖 *HELP MENU*

• .help <category>
• .help <command>

📂 *Categories*
`

            Object.keys(categoryEmojis).forEach(c => {
                helpText += `• ${categoryEmojis[c]} ${c}\n`
            })

            return await conn.sendMessage(
                from,
                { text: helpText, contextInfo: CONTEXT_META },
                { quoted: mek }
            )
        }

        const query = args[0].toLowerCase()

        // Command help
        if (commandHelp[query]) {
            const c = commandHelp[query]
            return await conn.sendMessage(
                from,
                {
                    text: `📖 *COMMAND INFO*

• Command: .${c.pattern}
• Category: ${c.category}
• Description: ${c.desc}
`,
                    contextInfo: CONTEXT_META
                },
                { quoted: mek }
            )
        }

        // Category help
        const catCmds = Object.values(commandHelp).filter(c => c.category === query)
        if (catCmds.length) {
            let txt = `${categoryEmojis[query] || '📁'} *${query.toUpperCase()} COMMANDS*\n\n`
            catCmds.forEach(c => {
                txt += `• .${c.pattern} — ${c.desc}\n`
            })

            return await conn.sendMessage(
                from,
                { text: txt, contextInfo: CONTEXT_META },
                { quoted: mek }
            )
        }

        await conn.sendMessage(
            from,
            {
                text: `❌ Not found.\nTry *.menu* or *.help*`,
                contextInfo: CONTEXT_META
            },
            { quoted: mek }
        )

    } catch (e) {
        console.error('[HELP ERROR]', e)
    }
})

module.exports = {}

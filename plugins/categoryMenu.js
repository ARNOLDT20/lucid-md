const { cmd, commands } = require('../command')

const categories = ['main', 'download', 'group', 'convert', 'ai', 'tools', 'search', 'fun', 'voice', 'other']

for (const cat of categories) {
    // don't register if a command with same pattern already exists
    const exists = commands.find(c => c.pattern === cat)
    if (exists) continue

    cmd({
        pattern: cat,
        desc: `Quick list of ${cat} commands (up to 5)`,
        category: cat,
        react: '📂',
        filename: __filename
    }, async (conn, mek, m, { from, reply }) => {
        try {
            const list = commands.filter(c => (c.category || 'other') === cat && c.pattern && !c.dontAddCommandList)
            if (!list || list.length === 0) return reply(`No commands available for category ${cat}`)
            const items = list.slice(0, 5).map(c => `.${c.pattern}${c.desc ? ' - ' + c.desc : ''}`)
            const text = `*${cat.toUpperCase()}* commands (showing ${items.length} of ${list.length}):\n\n` + items.join('\n')
            await conn.sendMessage(from, { text }, { quoted: mek })
        } catch (e) {
            console.error('categoryMenu error:', e)
            reply('Failed to fetch category commands')
        }
    })
}

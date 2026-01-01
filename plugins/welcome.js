const { cmd } = require('../command')
const welcomeSettings = require('../lib/welcomeSettings')

// Initialize persisted defaults for existing groups when the plugin is initialized
module.exports.init = async (conn) => {
    try {
        const groups = Object.keys(await conn.groupFetchAllParticipating())
        for (const g of groups) {
            const cur = welcomeSettings.get(g) || {}
            // persist defaults if not explicitly present
            welcomeSettings.set(g, { welcome: cur.welcome === undefined ? true : cur.welcome, goodbye: cur.goodbye === undefined ? true : cur.goodbye })
        }
    } catch (e) {
        console.error('welcome.init error:', e)
    }
}

cmd({ pattern: 'welcome', desc: 'Toggle welcome messages for this group', category: 'group', react: '👋', filename: __filename }, async (conn, mek, m, { from, reply }) => {
    const arg = (m.body || '').trim().split(/ +/)[1]
    if (!arg) return reply('Usage: .welcome on|off')
    const enabled = arg.toLowerCase() === 'on'
    welcomeSettings.setWelcome(from, enabled)
    reply(`Welcome messages are now ${enabled ? 'enabled' : 'disabled'} for this group.`)
})

cmd({ pattern: 'goodbye', desc: 'Toggle goodbye messages for this group', category: 'group', react: '👋', filename: __filename }, async (conn, mek, m, { from, reply }) => {
    const arg = (m.body || '').trim().split(/ +/)[1]
    if (!arg) return reply('Usage: .goodbye on|off')
    const enabled = arg.toLowerCase() === 'on'
    welcomeSettings.setGoodbye(from, enabled)
    reply(`Goodbye messages are now ${enabled ? 'enabled' : 'disabled'} for this group.`)
})

cmd({ pattern: 'setwelcome', desc: 'Set welcome message text for this group (use {user}, {group}, {count})', category: 'group', react: '✏️', filename: __filename }, async (conn, mek, m, { from, reply, quoted }) => {
    const text = (m.body || '').trim().split(/ +/).slice(1).join(' ') || (quoted && quoted.text) || ''
    if (!text) return reply('Usage: .setwelcome <text> or reply with text')
    welcomeSettings.setWelcomeMsg(from, text)
    reply('Welcome message updated for this group.')
})

cmd({ pattern: 'setgoodbye', desc: 'Set goodbye message text for this group (use {user}, {group}, {count})', category: 'group', react: '✏️', filename: __filename }, async (conn, mek, m, { from, reply, quoted }) => {
    const text = (m.body || '').trim().split(/ +/).slice(1).join(' ') || (quoted && quoted.text) || ''
    if (!text) return reply('Usage: .setgoodbye <text> or reply with text')
    welcomeSettings.setGoodbyeMsg(from, text)
    reply('Goodbye message updated for this group.')
})

module.exports = {}

const { cmd } = require('../command')
const statusSettings = require('../lib/statusSettings')

cmd({
    pattern: 'autoviewstatus',
    desc: 'Toggle auto view of statuses (owner only).',
    category: 'owner',
    react: '👁️',
    filename: __filename
}, async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply('Only owner can toggle.')
    try {
        const state = statusSettings.toggleAutoView()
        reply(`Auto-view status is now ${state ? 'enabled' : 'disabled'}.`)
    } catch (e) {
        console.error('autoviewstatus error:', e)
        reply('Failed to toggle auto-view status')
    }
})

cmd({
    pattern: 'autolikestatus',
    desc: 'Toggle auto like of statuses (owner only).',
    category: 'owner',
    react: '❤️',
    filename: __filename
}, async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply('Only owner can toggle.')
    try {
        const state = statusSettings.toggleAutoLike()
        reply(`Auto-like status is now ${state ? 'enabled' : 'disabled'}.`)
    } catch (e) {
        console.error('autolikestatus error:', e)
        reply('Failed to toggle auto-like status')
    }
})

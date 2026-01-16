const { cmd, commands } = require('../command')
const statusSettings = require('../lib/statusSettings')

// Auto view status toggle
if (!commands.find(c => c.pattern === 'autoview')) {
    cmd({
        pattern: 'autoview',
        desc: 'Toggle auto-view status updates (on/off)',
        category: 'tools',
        react: '👁️',
        filename: __filename
    }, async (conn, mek, m, { reply }) => {
        try {
            const current = statusSettings.isAutoView()
            const newStatus = !current
            statusSettings.setAutoView(newStatus)

            const status = newStatus ? '✅ ON' : '❌ OFF'
            const emoji = newStatus ? '✔️' : '⚠️'

            reply(`${emoji} *Auto View Status* is now: ${status}\n\nYour bot will ${newStatus ? 'automatically view' : 'NOT view'} new status updates.`)
        } catch (e) {
            console.error('autoview error:', e)
            reply('❌ Failed to toggle auto-view status')
        }
    })
}

// Auto react to status toggle
if (!commands.find(c => c.pattern === 'autoreact')) {
    cmd({
        pattern: 'autoreact',
        desc: 'Toggle auto-react to status updates (on/off)',
        category: 'tools',
        react: '❤️',
        filename: __filename
    }, async (conn, mek, m, { reply }) => {
        try {
            const current = statusSettings.isAutoLike()
            const newStatus = !current
            statusSettings.setAutoLike(newStatus)

            const status = newStatus ? '✅ ON' : '❌ OFF'
            const emoji = newStatus ? '✔️' : '⚠️'

            reply(`${emoji} *Auto React to Status* is now: ${status}\n\nYour bot will ${newStatus ? 'automatically react (❤️) to' : 'NOT react to'} new status updates.`)
        } catch (e) {
            console.error('autoreact error:', e)
            reply('❌ Failed to toggle auto-react status')
        }
    })
}

// Status settings info
if (!commands.find(c => c.pattern === 'statusinfo')) {
    cmd({
        pattern: 'statusinfo',
        desc: 'Check current status auto settings',
        category: 'tools',
        react: '📊',
        filename: __filename
    }, async (conn, mek, m, { reply }) => {
        try {
            const autoView = statusSettings.isAutoView()
            const autoReact = statusSettings.isAutoLike()

            const viewStatus = autoView ? '✅ ENABLED' : '❌ DISABLED'
            const reactStatus = autoReact ? '✅ ENABLED' : '❌ DISABLED'

            let info = `
╔════════════════════════════════╗
║  📊 STATUS AUTO SETTINGS 📊    ║
╚════════════════════════════════╝

👁️ *Auto View Status:* ${viewStatus}
   → Automatically marks seen
   
❤️ *Auto React to Status:* ${reactStatus}
   → Automatically reacts with ❤️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 *Commands to Toggle:*
• .autoview  → Turn on/off auto-view
• .autoreact → Turn on/off auto-react

📝 *Examples:*
.autoview   → Toggle viewing
.autoreact  → Toggle reactions
`

            reply(info)
        } catch (e) {
            console.error('statusinfo error:', e)
            reply('❌ Failed to get status settings')
        }
    })
}

// Enable both auto features
if (!commands.find(c => c.pattern === 'statusauto')) {
    cmd({
        pattern: 'statusauto',
        desc: 'Enable all automatic status features',
        category: 'tools',
        react: '⚡',
        filename: __filename
    }, async (conn, mek, m, { reply }) => {
        try {
            statusSettings.setAutoView(true)
            statusSettings.setAutoLike(true)

            reply(`⚡ *All Auto Status Features Enabled* ⚡\n\n✅ Auto View: ENABLED\n✅ Auto React: ENABLED\n\nYour bot will now automatically view and react to all status updates!`)
        } catch (e) {
            console.error('statusauto error:', e)
            reply('❌ Failed to enable auto status features')
        }
    })
}

// Disable both auto features
if (!commands.find(c => c.pattern === 'statusoff')) {
    cmd({
        pattern: 'statusoff',
        desc: 'Disable all automatic status features',
        category: 'tools',
        react: '🛑',
        filename: __filename
    }, async (conn, mek, m, { reply }) => {
        try {
            statusSettings.setAutoView(false)
            statusSettings.setAutoLike(false)

            reply(`🛑 *All Auto Status Features Disabled* 🛑\n\n❌ Auto View: DISABLED\n❌ Auto React: DISABLED\n\nYour bot will NOT automatically interact with status updates.`)
        } catch (e) {
            console.error('statusoff error:', e)
            reply('❌ Failed to disable auto status features')
        }
    })
}

module.exports = {}

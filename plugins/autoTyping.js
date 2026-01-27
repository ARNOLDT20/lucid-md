const { cmd, commands } = require('../command')
const globalSettings = require('../lib/globalSettings')

// Auto typing toggle
if (!commands.find(c => c.pattern === 'autotype')) {
    cmd({
        pattern: 'autotype',
        desc: 'Toggle auto-typing indicator when responding to commands',
        category: 'tools',
        react: '⌨️',
        filename: __filename
    }, async (conn, mek, m, { reply }) => {
        try {
            const current = globalSettings.isAutoTyping()
            const newStatus = !current
            globalSettings.setAutoTyping(newStatus)

            const status = newStatus ? '✅ ON' : '❌ OFF'
            const emoji = newStatus ? '✔️' : '⚠️'

            reply(`${emoji} *Auto Typing Indicator* is now: ${status}\n\nBot will ${newStatus ? 'show typing indicator' : 'NOT show typing indicator'} when executing commands.`)
        } catch (e) {
            console.error('autotype error:', e)
            reply('❌ Failed to toggle auto-typing')
        }
    })
}

// Auto recording toggle
if (!commands.find(c => c.pattern === 'autorec')) {
    cmd({
        pattern: 'autorec',
        desc: 'Toggle auto-recording indicator when responding to commands',
        category: 'tools',
        react: '🎙️',
        filename: __filename
    }, async (conn, mek, m, { reply }) => {
        try {
            const current = globalSettings.isAutoRecording()
            const newStatus = !current
            globalSettings.setAutoRecording(newStatus)

            const status = newStatus ? '✅ ON' : '❌ OFF'
            const emoji = newStatus ? '✔️' : '⚠️'

            reply(`${emoji} *Auto Recording Indicator* is now: ${status}\n\nBot will ${newStatus ? 'show recording indicator' : 'NOT show recording indicator'} when executing commands.`)
        } catch (e) {
            console.error('autorec error:', e)
            reply('❌ Failed to toggle auto-recording')
        }
    })
}

// Check typing settings
if (!commands.find(c => c.pattern === 'typinginfo')) {
    cmd({
        pattern: 'typinginfo',
        desc: 'Check current typing and recording settings',
        category: 'tools',
        react: '📋',
        filename: __filename
    }, async (conn, mek, m, { reply }) => {
        try {
            const autoType = globalSettings.isAutoTyping()
            const autoRec = globalSettings.isAutoRecording()

            const typeStatus = autoType ? '✅ ENABLED' : '❌ DISABLED'
            const recStatus = autoRec ? '✅ ENABLED' : '❌ DISABLED'

            let info = `
╔════════════════════════════════╗
║  ⌨️ TYPING/REC SETTINGS ⌨️     ║
╚════════════════════════════════╝

⌨️ *Auto Typing Indicator:* ${typeStatus}
   → Shows typing when processing commands
   
🎙️ *Auto Recording Indicator:* ${recStatus}
   → Shows recording when processing commands

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 *Commands to Toggle:*
• .autotype → Turn on/off auto-typing
• .autorec  → Turn on/off auto-recording

📝 *What they do:*
Typing: Shows that bot is "typing..."
Recording: Shows that bot is "recording..."
`

            reply(info)
        } catch (e) {
            console.error('typinginfo error:', e)
            reply('❌ Failed to get typing settings')
        }
    })
}

module.exports = {}

const { cmd, commands } = require('../command')
const modeSettings = require('../lib/modeSettings')

// Set bot to public mode
if (!commands.find(c => c.pattern === 'public')) {
    cmd({
        pattern: 'public',
        desc: 'Set bot to public mode (anyone can use commands)',
        category: 'owner',
        react: '🌐',
        filename: __filename
    }, async (conn, mek, m, { reply, isOwner }) => {
        try {
            if (!isOwner) return reply('❌ Only the owner can change bot mode!')
            
            modeSettings.setPublic(true)
            
            reply(`🌐 *Public Mode Enabled* 🌐\n\n✅ Anyone can now use bot commands\n❌ Owner restriction removed\n\nType .private to switch back to private mode.`)
        } catch (e) {
            console.error('public mode error:', e)
            reply('❌ Failed to set public mode')
        }
    })
}

// Set bot to private mode
if (!commands.find(c => c.pattern === 'private')) {
    cmd({
        pattern: 'private',
        desc: 'Set bot to private mode (only owner can use commands)',
        category: 'owner',
        react: '🔒',
        filename: __filename
    }, async (conn, mek, m, { reply, isOwner }) => {
        try {
            if (!isOwner) return reply('❌ Only the owner can change bot mode!')
            
            modeSettings.setPublic(false)
            
            reply(`🔒 *Private Mode Enabled* 🔒\n\n✅ Only owner can use commands\n✅ All others are blocked\n\nType .public to switch to public mode.`)
        } catch (e) {
            console.error('private mode error:', e)
            reply('❌ Failed to set private mode')
        }
    })
}

// Check current bot mode
if (!commands.find(c => c.pattern === 'botmode')) {
    cmd({
        pattern: 'botmode',
        desc: 'Check current bot mode (public/private)',
        category: 'owner',
        react: '⚙️',
        filename: __filename
    }, async (conn, mek, m, { reply, isOwner }) => {
        try {
            const isPublic = modeSettings.isPublic()
            const mode = isPublic ? 'PUBLIC 🌐' : 'PRIVATE 🔒'
            const description = isPublic 
                ? 'Anyone can use commands' 
                : 'Only owner can use commands'
            
            let info = `
╔════════════════════════════════╗
║     ⚙️ BOT MODE STATUS ⚙️       ║
╚════════════════════════════════╝

🤖 *Current Mode:* ${mode}
📝 *Description:* ${description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${isPublic ? '🌐 PUBLIC MODE' : '🔒 PRIVATE MODE'}

${isPublic 
    ? '✅ Everyone can use commands\n❌ No owner restriction\n\n📝 To enable private mode:\n.private' 
    : '✅ Only owner can use commands\n❌ Others are blocked\n\n📝 To enable public mode:\n.public'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 *Commands:*
• .public  → Enable public mode
• .private → Enable private mode
`
            
            reply(info)
        } catch (e) {
            console.error('botmode error:', e)
            reply('❌ Failed to get bot mode')
        }
    })
}

// Toggle bot mode
if (!commands.find(c => c.pattern === 'togglemode')) {
    cmd({
        pattern: 'togglemode',
        desc: 'Toggle between public and private mode',
        category: 'owner',
        react: '🔄',
        filename: __filename
    }, async (conn, mek, m, { reply, isOwner }) => {
        try {
            if (!isOwner) return reply('❌ Only the owner can change bot mode!')
            
            const newMode = modeSettings.toggle()
            const modeText = newMode ? 'PUBLIC 🌐' : 'PRIVATE 🔒'
            const description = newMode 
                ? 'Anyone can now use commands' 
                : 'Only owner can use commands'
            
            reply(`🔄 *Bot Mode Toggled* 🔄\n\n📝 New Mode: ${modeText}\n✅ ${description}`)
        } catch (e) {
            console.error('togglemode error:', e)
            reply('❌ Failed to toggle bot mode')
        }
    })
}

module.exports = {}

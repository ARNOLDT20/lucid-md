const { cmd } = require('../command')
const globalSettings = require('../lib/globalSettings')

cmd({
    pattern: 'autotyping',
    desc: 'Toggle auto typing (shows typing indicator)',
    category: 'tools',
    react: '⌨️',
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup, isOwner }) => {
    try {
        if (!isOwner) {
            return await reply('❌ This command is for owners only!')
        }

        const newState = globalSettings.toggleAutoTyping()
        const status = newState ? '✅ ENABLED' : '❌ DISABLED'

        await reply(`⌨️ *Auto Typing ${status}*\n\nThe bot will now ${newState ? 'show typing indicators' : 'not show typing indicators'} when processing messages.`)
    } catch (e) {
        console.error('autotyping error:', e)
        await reply('❌ Failed to toggle auto typing')
    }
})

cmd({
    pattern: 'autorecording',
    desc: 'Toggle auto recording (shows recording indicator)',
    category: 'tools',
    react: '🎙️',
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup, isOwner }) => {
    try {
        if (!isOwner) {
            return await reply('❌ This command is for owners only!')
        }

        const newState = globalSettings.toggleAutoRecording()
        const status = newState ? '✅ ENABLED' : '❌ DISABLED'

        await reply(`🎙️ *Auto Recording ${status}*\n\nThe bot will now ${newState ? 'show recording indicators' : 'not show recording indicators'} when processing messages.`)
    } catch (e) {
        console.error('autorecording error:', e)
        await reply('❌ Failed to toggle auto recording')
    }
})

cmd({
    pattern: 'autoreact',
    desc: 'Toggle auto react to status with random emojis',
    category: 'tools',
    react: '😍',
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup, isOwner }) => {
    try {
        if (!isOwner) {
            return await reply('❌ This command is for owners only!')
        }

        const newState = globalSettings.toggleAutoReact()
        const status = newState ? '✅ ENABLED' : '❌ DISABLED'

        await reply(`😍 *Auto React ${status}*\n\nThe bot will now ${newState ? 'react to statuses with random emojis' : 'not react to statuses'}.`)
    } catch (e) {
        console.error('autoreact error:', e)
        await reply('❌ Failed to toggle auto react')
    }
})

cmd({
    pattern: 'settings',
    desc: 'View current bot settings',
    category: 'tools',
    react: '⚙️',
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup, isOwner }) => {
    try {
        if (!isOwner) {
            return await reply('❌ This command is for owners only!')
        }

        const settings = globalSettings.getAll()

        let settingsText = `⚙️ *BOT SETTINGS*\n\n`
        settingsText += `⌨️ Auto Typing: ${settings.autoTyping ? '✅ ON' : '❌ OFF'}\n`
        settingsText += `🎙️ Auto Recording: ${settings.autoRecording ? '✅ ON' : '❌ OFF'}\n`
        settingsText += `😍 Auto React: ${settings.autoReact ? '✅ ON' : '❌ OFF'}\n\n`
        settingsText += `💡 *Random Emojis for Auto React:*\n${settings.randomEmojis.join(' ')}\n\n`
        settingsText += `📝 Use:\n`
        settingsText += `.autotyping - Toggle auto typing\n`
        settingsText += `.autorecording - Toggle auto recording\n`
        settingsText += `.autoreact - Toggle auto react\n`
        settingsText += `.setemojis <emoji> <emoji> ... - Set custom emojis`

        await reply(settingsText)
    } catch (e) {
        console.error('settings error:', e)
        await reply('❌ Failed to display settings')
    }
})

cmd({
    pattern: 'setemojis',
    desc: 'Set custom emojis for auto react',
    category: 'tools',
    react: '✨',
    filename: __filename
}, async (conn, mek, m, { from, reply, args, isGroup, isOwner }) => {
    try {
        if (!isOwner) {
            return await reply('❌ This command is for owners only!')
        }

        if (args.length === 0) {
            return await reply('❌ Please provide at least one emoji!\n\nExample: .setemojis ❤️ 😂 😍 🔥 👍')
        }

        const emojis = args.slice(0)
        globalSettings.setRandomEmojis(emojis)

        await reply(`✨ *Custom Emojis Set!*\n\n${emojis.join(' ')}\n\nThese emojis will now be used for auto react.`)
    } catch (e) {
        console.error('setemojis error:', e)
        await reply('❌ Failed to set emojis')
    }
})

module.exports = { init: () => { } }

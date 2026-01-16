const { cmd, commands } = require('../command')
const welcomeSettings = require('../lib/welcomeSettings')
const welcomeTemplates = require('../lib/welcome')
const goodbyeTemplates = require('../lib/goodbye')
const axios = require('axios')

// Helper function to get profile picture
async function getProfilePicture(conn, number) {
    try {
        const image = await conn.profilePictureUrl(number + '@s.whatsapp.net', 'image').catch(() => null)
        return image
    } catch (e) {
        return null
    }
}

// Get total member count for a group
async function getMemberCount(groupMetadata) {
    return groupMetadata?.participants?.length || 0
}

// Enable welcome messages
if (!commands.find(c => c.pattern === 'welcome')) {
    cmd({
        pattern: 'welcome',
        desc: 'Enable/disable welcome messages in group',
        category: 'group',
        react: '👋',
        filename: __filename
    }, async (conn, mek, m, { from, reply, isGroup, isAdmins, isBotAdmins, args, groupMetadata }) => {
        try {
            if (!isGroup) return reply('❌ This command only works in groups!')
            if (!isAdmins && !isBotAdmins) return reply('❌ You must be admin!')

            const action = args[0]?.toLowerCase()

            if (action === 'on') {
                welcomeSettings.setWelcome(from, true)
                reply('✅ Welcome messages enabled for this group!')
            } else if (action === 'off') {
                welcomeSettings.setWelcome(from, false)
                reply('✅ Welcome messages disabled for this group!')
            } else {
                const settings = welcomeSettings.get(from)
                const status = settings.welcome ? '✅ ON' : '❌ OFF'
                reply(`📋 Welcome messages are currently: ${status}\n\nUse: .welcome on/off`)
            }
        } catch (e) {
            console.error('welcome command error:', e)
            reply('❌ Error managing welcome settings')
        }
    })
}

// Enable goodbye messages
if (!commands.find(c => c.pattern === 'goodbye')) {
    cmd({
        pattern: 'goodbye',
        desc: 'Enable/disable goodbye messages in group',
        category: 'group',
        react: '👋',
        filename: __filename
    }, async (conn, mek, m, { from, reply, isGroup, isAdmins, isBotAdmins, args }) => {
        try {
            if (!isGroup) return reply('❌ This command only works in groups!')
            if (!isAdmins && !isBotAdmins) return reply('❌ You must be admin!')

            const action = args[0]?.toLowerCase()

            if (action === 'on') {
                welcomeSettings.setGoodbye(from, true)
                reply('✅ Goodbye messages enabled for this group!')
            } else if (action === 'off') {
                welcomeSettings.setGoodbye(from, false)
                reply('✅ Goodbye messages disabled for this group!')
            } else {
                const settings = welcomeSettings.get(from)
                const status = settings.goodbye ? '✅ ON' : '❌ OFF'
                reply(`📋 Goodbye messages are currently: ${status}\n\nUse: .goodbye on/off`)
            }
        } catch (e) {
            console.error('goodbye command error:', e)
            reply('❌ Error managing goodbye settings')
        }
    })
}

// Set custom welcome message
if (!commands.find(c => c.pattern === 'setwelcome')) {
    cmd({
        pattern: 'setwelcome',
        desc: 'Set custom welcome message. Use @user for member name, @members for total members',
        category: 'group',
        react: '✏️',
        filename: __filename
    }, async (conn, mek, m, { from, reply, isGroup, isAdmins, isBotAdmins, q }) => {
        try {
            if (!isGroup) return reply('❌ This command only works in groups!')
            if (!isAdmins && !isBotAdmins) return reply('❌ You must be admin!')
            if (!q) return reply('❌ Please provide a welcome message!\n\nExample: .setwelcome Welcome @user to our group! Total members: @members')

            welcomeSettings.setWelcomeMsg(from, q)
            reply('✅ Custom welcome message set!\n\nVariables:\n@user - Member name\n@members - Total members\n\n' + q)
        } catch (e) {
            console.error('setwelcome error:', e)
            reply('❌ Error setting welcome message')
        }
    })
}

// Set custom goodbye message
if (!commands.find(c => c.pattern === 'setgoodbye')) {
    cmd({
        pattern: 'setgoodbye',
        desc: 'Set custom goodbye message. Use @user for member name, @members for total members',
        category: 'group',
        react: '✏️',
        filename: __filename
    }, async (conn, mek, m, { from, reply, isGroup, isAdmins, isBotAdmins, q }) => {
        try {
            if (!isGroup) return reply('❌ This command only works in groups!')
            if (!isAdmins && !isBotAdmins) return reply('❌ You must be admin!')
            if (!q) return reply('❌ Please provide a goodbye message!\n\nExample: .setgoodbye Goodbye @user! You were one of our @members members.')

            welcomeSettings.setGoodbyeMsg(from, q)
            reply('✅ Custom goodbye message set!\n\n' + q)
        } catch (e) {
            console.error('setgoodbye error:', e)
            reply('❌ Error setting goodbye message')
        }
    })
}

// Send welcome to new member manually
if (!commands.find(c => c.pattern === 'sendwelcome')) {
    cmd({
        pattern: 'sendwelcome',
        desc: 'Send welcome message to a member',
        category: 'group',
        react: '👋',
        filename: __filename
    }, async (conn, mek, m, { from, reply, isGroup, quoted, groupMetadata }) => {
        try {
            if (!isGroup) return reply('❌ This command only works in groups!')

            const mentionedJid = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || quoted?.participant
            if (!mentionedJid) return reply('❌ Please mention or reply to a member!')

            const memberNumber = mentionedJid.split('@')[0]
            const settings = welcomeSettings.get(from)
            const memberCount = await getMemberCount(groupMetadata)

            // Get profile picture
            const profilePicUrl = await getProfilePicture(conn, memberNumber)

            let welcomeText = settings.welcomeMsg || `╔════════════════════════════════╗
║      ✨ WELCOME TO THE GROUP ✨  ║
╚════════════════════════════════╝

👋 Hey @user!

Welcome to our amazing community! 🎉
We're excited to have you here.

📊 Total Members: @members
🎊 Let's have fun together!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Read the rules & enjoy your stay!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

            // Replace variables
            const memberName = (await conn.getName(mentionedJid)) || memberNumber
            welcomeText = welcomeText
                .replace(/@user/g, memberName)
                .replace(/@members/g, memberCount)

            // Send message with profile picture if available
            if (profilePicUrl) {
                try {
                    await conn.sendMessage(from, {
                        image: { url: profilePicUrl },
                        caption: welcomeText
                    })
                } catch (picError) {
                    await conn.sendMessage(from, { text: welcomeText })
                }
            } else {
                await conn.sendMessage(from, { text: welcomeText })
            }

            reply('✅ Welcome message sent!')
        } catch (e) {
            console.error('sendwelcome error:', e)
            reply('❌ Error sending welcome message')
        }
    })
}

// Default templates
const DEFAULT_WELCOME_MSG = welcomeTemplates.DEFAULT_MSG
const DEFAULT_GOODBYE_MSG = goodbyeTemplates.DEFAULT_MSG

module.exports = {
    defaults: {
        welcomeMsg: DEFAULT_WELCOME_MSG,
        goodbyeMsg: DEFAULT_GOODBYE_MSG
    }
}

const { cmd, commands } = require('../command')
const warnsSettings = require('../lib/warnsSettings')

// URL pattern regex to detect links
const URL_REGEX = /https?:\/\/[^\s]+|www\.[^\s]+|discord\.gg\/[^\s]+|t\.me\/[^\s]+/gi

// Store antilink settings per group
const antiLinkSettings = new Map()

// Helper function to get antilink status
function getAntiLinkStatus(groupId) {
    if (!antiLinkSettings.has(groupId)) {
        // Default: antilink disabled
        antiLinkSettings.set(groupId, { enabled: false, maxWarns: 5 })
    }
    return antiLinkSettings.get(groupId)
}

// Enable antilink
cmd({
    pattern: 'antilink',
    desc: 'Enable/disable antilink in group',
    category: 'group',
    react: '🔗',
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup, isAdmins, isBotAdmins, args }) => {
    try {
        if (!isGroup) return reply('❌ This command only works in groups!')
        if (!isAdmins && !isBotAdmins) return reply('❌ You must be admin!')

        const action = args[0]?.toLowerCase()
        const status = getAntiLinkStatus(from)

        if (action === 'on') {
            status.enabled = true
            antiLinkSettings.set(from, status)
            reply(`✅ Antilink enabled!\n\n🔗 Links will be auto-deleted\n⚠️ Senders will receive warns\n⚡ Maximum warns: ${status.maxWarns}`)
        } else if (action === 'off') {
            status.enabled = false
            antiLinkSettings.set(from, status)
            reply('✅ Antilink disabled!')
        } else {
            const statusText = status.enabled ? '✅ ON' : '❌ OFF'
            reply(`📋 Antilink Status: ${statusText}\n\nUsage: .antilink on/off`)
        }
    } catch (e) {
        console.error('antilink command error:', e)
        reply('❌ Error managing antilink settings')
    }
})

// Set max warns before kick
cmd({
    pattern: 'maxwarns',
    desc: 'Set maximum warns before user is kicked',
    category: 'group',
    react: '⚠️',
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup, isAdmins, isBotAdmins, args }) => {
    try {
        if (!isGroup) return reply('❌ This command only works in groups!')
        if (!isAdmins && !isBotAdmins) return reply('❌ You must be admin!')

        const num = parseInt(args[0])
        if (isNaN(num) || num < 1 || num > 20) {
            return reply('❌ Please provide a number between 1-20\n\nExample: .maxwarns 5')
        }

        const status = getAntiLinkStatus(from)
        status.maxWarns = num
        antiLinkSettings.set(from, status)

        reply(`✅ Maximum warns set to ${num}\n\nUsers will be kicked after ${num} warns`)
    } catch (e) {
        console.error('maxwarns command error:', e)
        reply('❌ Error setting max warns')
    }
})

// Check warns for a user
cmd({
    pattern: 'warns',
    desc: 'Check warns for yourself or mentioned user',
    category: 'group',
    react: '⚠️',
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup, quoted, sender, mentionedJid }) => {
    try {
        if (!isGroup) return reply('❌ This command only works in groups!')

        // Get target user (mentioned, quoted, or self)
        let targetJid = sender
        if (mentionedJid && mentionedJid[0]) {
            targetJid = mentionedJid[0]
        } else if (quoted) {
            targetJid = quoted.participant || quoted.sender
        }

        const targetNumber = targetJid.split('@')[0]
        const targetName = (await conn.getName(targetJid)) || targetNumber
        let info = `╔════════════════════════════════╗
║          ⚠️ WARNS INFO ⚠️          ║
╚════════════════════════════════╝

👤 *User:* ${targetName}
📍 *Number:* ${targetNumber}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ *Current Warns:* ${userWarns.count}/${status.maxWarns}
📊 *Progress:* ${getProgressBar(userWarns.count, status.maxWarns)}`

        if (userWarns.count >= status.maxWarns) {
            info += `\n\n🚨 *STATUS:* KICKABLE (User can be removed)`
        } else if (userWarns.count >= status.maxWarns - 1) {
            info += `\n\n⚡ *STATUS:* ONE WARN AWAY FROM KICK`
        }

        if (userWarns.reasons && userWarns.reasons.length > 0) {
            info += `\n\n*Recent Warns:*`
            userWarns.reasons.slice(-3).forEach((r, i) => {
                info += `\n${i + 1}. ${r.reason} (${r.count})`
            })
        }

        info += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

        reply(info)
    } catch (e) {
        console.error('warns command error:', e)
        reply('❌ Error checking warns')
    }
})

// Remove a warn
cmd({
    pattern: 'removewarn',
    desc: 'Remove a warn from a user',
    category: 'group',
    react: '✅',
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup, isAdmins, isBotAdmins, quoted, mentionedJid }) => {
    try {
        if (!isGroup) return reply('❌ This command only works in groups!')
        if (!isAdmins && !isBotAdmins) return reply('❌ You must be admin!')

        let targetJid = null
        if (mentionedJid && mentionedJid[0]) {
            targetJid = mentionedJid[0]
        } else if (quoted) {
            targetJid = quoted.participant || quoted.sender
        }

        if (!targetJid) return reply('❌ Please mention or reply to a user')

        const targetName = (await conn.getName(targetJid)) || targetJid.split('@')[0]
        const result = warnsSettings.removeWarn(from, targetJid)

        if (result.removed) {
            reply(`✅ Removed a warn from ${targetName}\n\n⚠️ Current warns: ${result.newCount}`)
        } else {
            reply(`❌ ${targetName} has no warns to remove`)
        }
    } catch (e) {
        console.error('removewarn command error:', e)
        reply('❌ Error removing warn')
    }
})

// Clear all warns for a user
cmd({
    pattern: 'clearwarns',
    desc: 'Clear all warns for a user',
    category: 'group',
    react: '🧹',
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup, isAdmins, isBotAdmins, quoted, mentionedJid }) => {
    try {
        if (!isGroup) return reply('❌ This command only works in groups!')
        if (!isAdmins && !isBotAdmins) return reply('❌ You must be admin!')

        let targetJid = null
        if (mentionedJid && mentionedJid[0]) {
            targetJid = mentionedJid[0]
        } else if (quoted) {
            targetJid = quoted.participant || quoted.sender
        }

        if (!targetJid) return reply('❌ Please mention or reply to a user')

        const targetName = (await conn.getName(targetJid)) || targetJid.split('@')[0]
        const result = warnsSettings.clearWarns(from, targetJid)

        if (result) {
            reply(`✅ Cleared all warns for ${targetName}`)
        } else {
            reply(`ℹ️ ${targetName} had no warns`)
        }
    } catch (e) {
        console.error('clearwarns command error:', e)
        reply('❌ Error clearing warns')
    }
})

// Check top warned users
cmd({
    pattern: 'topwarns',
    desc: 'Show top warned users in group',
    category: 'group',
    react: '🏆',
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup }) => {
    try {
        if (!isGroup) return reply('❌ This command only works in groups!')

        const topWarned = warnsSettings.getTopWarned(from, 10)

        if (topWarned.length === 0) {
            return reply('✅ No warns in this group yet!')
        }

        let info = `╔════════════════════════════════╗
║    🏆 TOP WARNED USERS 🏆    ║
╚════════════════════════════════╝\n`

        for (let i = 0; i < topWarned.length; i++) {
            const user = topWarned[i]
            const userName = (await conn.getName(user.userId)) || user.userId.split('@')[0]
            info += `\n${i + 1}. ${userName}\n   ⚠️ Warns: ${user.count}`
        }

        info += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`

        reply(info)
    } catch (e) {
        console.error('topwarns command error:', e)
        reply('❌ Error getting top warns')
    }
})

// Helper function to create progress bar
function getProgressBar(current, max) {
    const percentage = Math.round((current / max) * 100)
    const filledLength = Math.round((current / max) * 10)
    let bar = ''
    for (let i = 0; i < 10; i++) {
        bar += i < filledLength ? '█' : '░'
    }
    return `${bar} ${percentage}%`
}

// Main message handler for link detection and auto-delete
const antilinkHandler = async (conn, mek, m, { from, reply, sender, groupMetadata, isGroup, isBotAdmins, isAdmins }) => {
    try {
        if (!isGroup) return

        const status = getAntiLinkStatus(from)
        if (!status.enabled) return

        const messageText = mek.message?.conversation ||
            mek.message?.extendedTextMessage?.text ||
            mek.message?.imageMessage?.caption ||
            mek.message?.videoMessage?.caption || ''

        if (!messageText) return

        // Check if message contains URLs
        if (URL_REGEX.test(messageText)) {
            const senderNumber = sender.split('@')[0]
            const senderName = (await conn.getName(sender)) || senderNumber

            // Don't warn admins or bot admins
            if (isAdmins || isBotAdmins) {
                console.log(`Antilink: Skipping admin @${senderNumber}`)
                return
            }

            // Add warn
            const warnResult = warnsSettings.addWarn(
                from,
                sender,
                'Sending links',
                status.maxWarns
            )

            // Delete the message
            try {
                await conn.sendMessage(from, { delete: mek.key })
            } catch (e) {
                console.error('Failed to delete message:', e)
            }

            // Send notification that links are not allowed
            try {
                await conn.sendMessage(from, {
                    text: `🚫 @${senderNumber}\n\n*Links are not allowed in this group!*\n\nPlease respect group rules and avoid sharing links.`,
                    mentions: [sender]
                })
            } catch (e) {
                console.error('Failed to send link restriction message:', e)
            }

            // Send warn message
            const warnMsg = `⚠️ *Link Detected!*

👤 User: @${senderNumber}
🔗 Links are not allowed here

⚠️ *Warns:* ${warnResult.newCount}/${warnResult.maxWarns}

${getProgressBar(warnResult.newCount, warnResult.maxWarns)}`

            try {
                await conn.sendMessage(from, {
                    text: warnMsg,
                    mentions: [sender]
                })
            } catch (e) {
                console.error('Failed to send warn message:', e)
            }

            // Kick if max warns reached
            if (warnResult.isKickable) {
                try {
                    await conn.groupParticipantsUpdate(from, [sender], 'remove')
                    await conn.sendMessage(from, {
                        text: `🚨 *User Kicked!*\n\n@${senderNumber} has been removed for exceeding maximum warns (${status.maxWarns})`,
                        mentions: [sender]
                    })
                } catch (e) {
                    console.error('Failed to kick user:', e)
                    try {
                        await conn.sendMessage(from, {
                            text: `⚠️ Failed to kick user. Please do it manually.`
                        })
                    } catch (e2) { }
                }
            }
        }
    } catch (e) {
        console.error('Antilink handler error:', e)
    }
}

// Export the handler to be used in index.js
module.exports = {
    antilinkHandler
}

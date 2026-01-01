const { cmd } = require('../command')
const welcomeSettings = require('../lib/welcomeSettings')

cmd({ pattern: 'welcome', desc: 'Toggle welcome messages for this group (owner/admin)', category: 'group', react: '👋', filename: __filename }, async (conn, mek, m, { from, isOwner, isAdmins, reply }) => {
    if (!isOwner && !isAdmins) return reply('Only owner or group admins can toggle welcome messages.')
    const arg = (m.body || '').trim().split(/ +/)[1]
    if (!arg) return reply('Usage: .welcome on|off')
    const enabled = arg.toLowerCase() === 'on'
    welcomeSettings.setWelcome(from, enabled)
    reply(`Welcome messages are now ${enabled ? 'enabled' : 'disabled'} for this group.`)
})

cmd({ pattern: 'goodbye', desc: 'Toggle goodbye messages for this group (owner/admin)', category: 'group', react: '👋', filename: __filename }, async (conn, mek, m, { from, isOwner, isAdmins, reply }) => {
    if (!isOwner && !isAdmins) return reply('Only owner or group admins can toggle goodbye messages.')
    const arg = (m.body || '').trim().split(/ +/)[1]
    if (!arg) return reply('Usage: .goodbye on|off')
    const enabled = arg.toLowerCase() === 'on'
    welcomeSettings.setGoodbye(from, enabled)
    reply(`Goodbye messages are now ${enabled ? 'enabled' : 'disabled'} for this group.`)
})

cmd({ pattern: 'setwelcome', desc: 'Set welcome message text for this group (use {user}, {group}, {count})', category: 'group', react: '✏️', filename: __filename }, async (conn, mek, m, { from, isOwner, isAdmins, reply, quoted }) => {
    if (!isOwner && !isAdmins) return reply('Only owner or group admins can set welcome message.')
    const text = (m.body || '').trim().split(/ +/).slice(1).join(' ') || (quoted && quoted.text) || ''
    if (!text) return reply('Usage: .setwelcome <text> or reply with text')
    welcomeSettings.setWelcomeMsg(from, text)
    reply('Welcome message updated for this group.')
})

cmd({ pattern: 'setgoodbye', desc: 'Set goodbye message text for this group (use {user}, {group}, {count})', category: 'group', react: '✏️', filename: __filename }, async (conn, mek, m, { from, isOwner, isAdmins, reply, quoted }) => {
    if (!isOwner && !isAdmins) return reply('Only owner or group admins can set goodbye message.')
    const text = (m.body || '').trim().split(/ +/).slice(1).join(' ') || (quoted && quoted.text) || ''
    if (!text) return reply('Usage: .setgoodbye <text> or reply with text')
    welcomeSettings.setGoodbyeMsg(from, text)
    reply('Goodbye message updated for this group.')
})

module.exports = {}

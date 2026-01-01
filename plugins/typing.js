const { cmd } = require('../command')

// Auto typing/recording toggle per-chat (in-memory)
const states = {} // { chatJid: { typing: bool, recording: bool, typingInterval, recordingInterval } }

cmd({
    pattern: 'autotyping',
    desc: 'Toggle auto typing for this chat (owner/admin).',
    category: 'tools',
    react: '⌨️',
    filename: __filename
}, async (conn, mek, m, { from, isOwner, isAdmins, reply, args }) => {
    // allow owner or group admin
    if (!isOwner && !isAdmins) return reply('Only owner/admins can toggle this.')
    states[from] = states[from] || { typing: false, recording: false, typingInterval: null, recordingInterval: null }
    states[from].typing = !states[from].typing
    // clear existing interval if any
    if (states[from].typingInterval) {
        clearInterval(states[from].typingInterval)
        states[from].typingInterval = null
    }
    if (states[from].typing) {
        // start continuous composing presence every 4s
        try {
            await conn.setPresence('composing', from)
        } catch (e) {
            console.error('setPresence initial error:', e)
        }
        states[from].typingInterval = setInterval(async () => {
            try {
                await conn.setPresence('composing', from)
            } catch (e) {
                console.error('setPresence interval error:', e)
            }
        }, 4000)
    } else {
        try { await conn.setPresence('available', from) } catch (e) { }
    }
    reply(`Auto-typing is now ${states[from].typing ? 'enabled' : 'disabled'} for this chat.`)
})

cmd({
    pattern: 'autorecord',
    desc: 'Toggle auto recording for this chat (owner/admin).',
    category: 'tools',
    react: '🔴',
    filename: __filename
}, async (conn, mek, m, { from, isOwner, isAdmins, reply, args }) => {
    if (!isOwner && !isAdmins) return reply('Only owner/admins can toggle this.')
    states[from] = states[from] || { typing: false, recording: false, typingInterval: null, recordingInterval: null }
    states[from].recording = !states[from].recording
    if (states[from].recordingInterval) {
        clearInterval(states[from].recordingInterval)
        states[from].recordingInterval = null
    }
    if (states[from].recording) {
        try {
            await conn.setPresence('recording', from)
        } catch (e) { console.error('setPresence initial error:', e) }
        states[from].recordingInterval = setInterval(async () => {
            try { await conn.setPresence('recording', from) } catch (e) { console.error('setPresence interval error:', e) }
        }, 4000)
    } else {
        try { await conn.setPresence('available', from) } catch (e) { }
    }
    reply(`Auto-recording is now ${states[from].recording ? 'enabled' : 'disabled'} for this chat.`)
})

// No-op middleware needed: continuous presence handled by intervals above.

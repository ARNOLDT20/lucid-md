const { cmd } = require('../command')
const config = require('../config')

let connRef = null

function startTypingFor(chat) {
    states[chat] = states[chat] || { typing: false, recording: false, typingInterval: null, recordingInterval: null }
    if (states[chat].typingInterval) return
    states[chat].typing = true
    states[chat].typingInterval = setInterval(async () => {
        try { if (connRef) await connRef.setPresence('composing', chat) } catch (e) { console.error('setPresence interval error:', e) }
    }, 4000)
}

function startRecordingFor(chat) {
    states[chat] = states[chat] || { typing: false, recording: false, typingInterval: null, recordingInterval: null }
    if (states[chat].recordingInterval) return
    states[chat].recording = true
    states[chat].recordingInterval = setInterval(async () => {
        try { if (connRef) await connRef.setPresence('recording', chat) } catch (e) { console.error('setPresence interval error:', e) }
    }, 4000)
}

function stopTypingFor(chat) {
    if (!states[chat]) return
    states[chat].typing = false
    if (states[chat].typingInterval) { clearInterval(states[chat].typingInterval); states[chat].typingInterval = null }
    try { if (connRef) connRef.setPresence('available', chat) } catch (e) { }
}

function stopRecordingFor(chat) {
    if (!states[chat]) return
    states[chat].recording = false
    if (states[chat].recordingInterval) { clearInterval(states[chat].recordingInterval); states[chat].recordingInterval = null }
    try { if (connRef) connRef.setPresence('available', chat) } catch (e) { }
}

async function init(conn) {
    connRef = conn
    // enable defaults on deploy
    if (config.DEFAULT_AUTOTYPING_ON_DEPLOY || config.DEFAULT_AUTORECORD_ON_DEPLOY) {
        try {
            const groups = Object.keys(await conn.groupFetchAllParticipating())
            for (const g of groups) {
                if (config.DEFAULT_AUTOTYPING_ON_DEPLOY) startTypingFor(g)
                if (config.DEFAULT_AUTORECORD_ON_DEPLOY) startRecordingFor(g)
            }
        } catch (e) {
            console.error('typing.init group fetch error:', e)
        }
    }
}

module.exports.init = init

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

const { cmd } = require('../command')
const config = require('../config')
const typingSettings = require('../lib/typingSettings')

let connRef = null

// In-memory state and last-trigger timestamps
const states = {} // { chatJid: { typing: bool, recording: bool, typingInterval, recordingInterval } }
const lastTrigger = {} // { chatJid: { typing: ts, recording: ts } }
const DEFAULT_COOLDOWN = 60

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
    // load persisted settings and start presence for those chats
    try {
        const all = typingSettings.getAll() || {}
        const keys = Object.keys(all)
        if (keys.length) {
            for (const chat of keys) {
                const s = all[chat]
                if (s && s.typingEnabled) startTypingFor(chat)
                if (s && s.recordingEnabled) startRecordingFor(chat)
            }
        } else if (config.DEFAULT_AUTOTYPING_ON_DEPLOY || config.DEFAULT_AUTORECORD_ON_DEPLOY) {
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
    } catch (e) {
        console.error('typing.init settings load error:', e)
    }

    // attach message listener once to show temporary presence when users message
    try {
        if (!conn._typingHandlerAttached) {
            conn.ev.on('messages.upsert', async (meks) => {
                for (const mek of meks.messages || []) {
                    try {
                        if (!mek || !mek.key || !mek.message) continue
                        if (mek.key.remoteJid === 'status@broadcast') continue
                        if (mek.key.fromMe) continue
                        const chat = mek.key.remoteJid
                        const cfg = typingSettings.get(chat) || { typingEnabled: false, recordingEnabled: false, cooldown: DEFAULT_COOLDOWN }
                        const now = Date.now()
                        lastTrigger[chat] = lastTrigger[chat] || { typing: 0, recording: 0 }

                        // typing
                        if ((cfg.typingEnabled || (states[chat] && states[chat].typing))) {
                            const cd = (cfg.cooldown || DEFAULT_COOLDOWN) * 1000
                            if (now - lastTrigger[chat].typing >= cd) {
                                lastTrigger[chat].typing = now
                                try { await conn.setPresence('composing', chat) } catch (e) { }
                                setTimeout(async () => { try { await conn.setPresence('available', chat) } catch (e) { } }, 3000)
                            }
                        }

                        // recording
                        if ((cfg.recordingEnabled || (states[chat] && states[chat].recording))) {
                            const cd = (cfg.cooldown || DEFAULT_COOLDOWN) * 1000
                            if (now - lastTrigger[chat].recording >= cd) {
                                lastTrigger[chat].recording = now
                                try { await conn.setPresence('recording', chat) } catch (e) { }
                                setTimeout(async () => { try { await conn.setPresence('available', chat) } catch (e) { } }, 3000)
                            }
                        }
                    } catch (e) { }
                }
            })
            conn._typingHandlerAttached = true
        }
    } catch (e) {
        console.error('typing.init listener attach error:', e)
    }
}

module.exports.init = init

// Commands: toggles persist to typingSettings and affect in-memory intervals

cmd({
    pattern: 'autotyping',
    desc: 'Toggle auto typing for this chat',
    category: 'tools',
    react: '⌨️',
    filename: __filename
}, async (conn, mek, m, { from, isOwner, isAdmins, reply }) => {
    if (!isOwner && !isAdmins) return reply('Admins or owner only.')

    const cur = typingSettings.get(from) || {}
    const next = !cur.typingEnabled
    typingSettings.setFlag(from, 'typingEnabled', next)

    next ? startInterval(from, 'typing') : stopInterval(from, 'typing')
    reply(`Auto-typing ${next ? 'enabled' : 'disabled'}.\nCooldown: ${cur.cooldown || DEFAULT_COOLDOWN}s`)
})

cmd({
    pattern: 'autorecord',
    desc: 'Toggle auto recording for this chat',
    category: 'tools',
    react: '🔴',
    filename: __filename
}, async (conn, mek, m, { from, isOwner, isAdmins, reply }) => {
    if (!isOwner && !isAdmins) return reply('Admins or owner only.')

    const cur = typingSettings.get(from) || {}
    const next = !cur.recordingEnabled
    typingSettings.setFlag(from, 'recordingEnabled', next)

    next ? startInterval(from, 'recording') : stopInterval(from, 'recording')
    reply(`Auto-recording ${next ? 'enabled' : 'disabled'}.\nCooldown: ${cur.cooldown || DEFAULT_COOLDOWN}s`)
})

cmd({
    pattern: 'autocooldown',
    desc: 'Set auto typing/record cooldown (seconds)',
    category: 'tools',
    react: '⏱️',
    filename: __filename
}, async (conn, mek, m, { from, isOwner, isAdmins, args, reply }) => {
    if (!isOwner && !isAdmins) return reply('Admins or owner only.')

    const sec = parseInt(args[0])
    if (!sec) {
        const cur = typingSettings.get(from) || {}
        return reply(`Current cooldown: ${cur.cooldown || DEFAULT_COOLDOWN}s`)
    }

    if (sec < 5 || sec > 600) return reply('Cooldown must be 5–600 seconds.')
    typingSettings.setCooldown(from, sec)
    reply(`Cooldown set to ${sec} seconds.`)
})

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys')

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const statusSettings = require('./lib/statusSettings')
const welcomeSettings = require('./lib/welcomeSettings')
const modeSettings = require('./lib/modeSettings')
const globalSettings = require('./lib/globalSettings')
const welcomeTemplates = require('./lib/welcome')
const goodbyeTemplates = require('./lib/goodbye')
const fs = require('fs')
const path = require('path')

// Load all plugins at startup to register commands
const pluginDir = path.join(__dirname, 'plugins')
if (fs.existsSync(pluginDir)) {
  // Clear any cached command module
  delete require.cache[require.resolve('./command')]

  // Load mainCommands first to ensure core commands are registered
  const mainCommandsPath = path.join(pluginDir, 'mainCommands.js')
  if (fs.existsSync(mainCommandsPath)) {
    try {
      delete require.cache[require.resolve(mainCommandsPath)]
      require(mainCommandsPath)
      const { commands } = require('./command')
      console.log(`[PLUGIN LOADER] Loaded mainCommands.js - Total commands: ${commands.length}`)
    } catch (e) {
      console.error(`[PLUGIN LOAD ERROR] Failed to load mainCommands.js:`, e.message)
    }
  }

  // Load all other plugins
  fs.readdirSync(pluginDir).forEach(file => {
    if (path.extname(file).toLowerCase() === '.js' && file !== 'mainCommands.js') {
      try {
        const filePath = path.join(pluginDir, file)
        delete require.cache[require.resolve(filePath)]
        require(filePath)
      } catch (e) {
        console.error(`[PLUGIN LOAD ERROR] Failed to load ${file}:`, e.message)
      }
    }
  })

  // Log final command count
  const { commands } = require('./command')
  console.log(`[PLUGIN LOADER] All plugins loaded - Total commands registered: ${commands.length}`)
}

// ensure bot runs in public mode (responds in both private and group chats)
try {
  const isPublic = modeSettings.isPublic()
  console.log('[MODE CHECK] Current mode is:', isPublic ? 'PUBLIC ✅' : 'PRIVATE')
  if (!isPublic) {
    modeSettings.setPublic(true)
    console.log('[MODE SET] Changed to PUBLIC mode ✅')
  }
} catch (e) {
  console.error('[MODE ERROR]', e && e.message ? e.message : e)
  modeSettings.setPublic(true)
}
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { sms, downloadMediaMessage } = require('./lib/msg')
const axios = require('axios')
const { File } = require('megajs')
const prefix = '.'

const ownerNumber = ['255627417402']

// connection state
let isConnected = false
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = process.env.MAX_RECONNECT_ATTEMPTS ? parseInt(process.env.MAX_RECONNECT_ATTEMPTS) : 5
// ensure we only send the post-connection message once
let connectionMessageSent = false

// ensure auth dir exists
const authDir = __dirname + '/auth_info_baileys/'
if (!fs.existsSync(authDir)) {
  try { fs.mkdirSync(authDir, { recursive: true }) } catch (e) { console.error('Failed to create auth dir:', e) }
}

// Global process handlers to prevent crashes
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason)
})
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
})

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
  if (!config.SESSION_ID) {
    console.warn('No session found and no SESSION_ID provided — skipping WhatsApp connect until session is added.')
  } else {
    (async () => {
      const sessdata = config.SESSION_ID.replace("POPKID;;;", '');
      try {
        const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
        // try download with simple retry
        let attempts = 0
        const tryDownload = () => new Promise((resolve, reject) => {
          filer.download((err, data) => {
            if (err) return reject(err)
            resolve(data)
          })
        })
        let data = null
        while (attempts < 3 && !data) {
          try {
            data = await tryDownload()
          } catch (e) {
            attempts++
            console.error('Session download attempt', attempts, 'failed:', e.message || e)
            await new Promise(r => setTimeout(r, 1000 * attempts))
          }
        }
        if (data) {
          fs.writeFileSync(__dirname + '/auth_info_baileys/creds.json', data)
          console.log("Session downloaded ✅")
        } else {
          console.error('Failed to download session after retries')
        }
      } catch (e) {
        console.error('Error fetching session from mega:', e.message || e)
      }
    })()
  }
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

// Simple in-memory rate-limiting for commands to avoid spam
const USER_CMD_RATE_LIMIT = process.env.USER_CMD_RATE_LIMIT ? parseInt(process.env.USER_CMD_RATE_LIMIT) : 5 // max commands
const USER_CMD_RATE_WINDOW = process.env.USER_CMD_RATE_WINDOW ? parseInt(process.env.USER_CMD_RATE_WINDOW) : 30 * 1000 // window in ms
const userCmdMap = {} // { userNumber: [timestamps] }

function isUserRateLimited(userNumber) {
  try {
    const now = Date.now()
    const arr = (userCmdMap[userNumber] || []).filter(ts => now - ts < USER_CMD_RATE_WINDOW)
    if (arr.length >= USER_CMD_RATE_LIMIT) {
      userCmdMap[userNumber] = arr
      return true
    }
    arr.push(now)
    userCmdMap[userNumber] = arr
    return false
  } catch (e) {
    return false
  }
}

// Rate limiting for auto-like reactions to prevent WhatsApp rate-limiting
const AUTO_LIKE_RATE_LIMIT = process.env.AUTO_LIKE_RATE_LIMIT ? parseInt(process.env.AUTO_LIKE_RATE_LIMIT) : 2 // max reactions per window
const AUTO_LIKE_RATE_WINDOW = process.env.AUTO_LIKE_RATE_WINDOW ? parseInt(process.env.AUTO_LIKE_RATE_WINDOW) : 60 * 1000 // window in ms (1 minute)
const autoLikeTimestamps = [] // array of timestamps for rate limiting

function canAutoLike() {
  try {
    const now = Date.now()
    // Remove old timestamps outside the rate window
    while (autoLikeTimestamps.length > 0 && now - autoLikeTimestamps[0] >= AUTO_LIKE_RATE_WINDOW) {
      autoLikeTimestamps.shift()
    }
    // Check if we've hit the limit
    if (autoLikeTimestamps.length >= AUTO_LIKE_RATE_LIMIT) {
      return false
    }
    // Add current timestamp and allow
    autoLikeTimestamps.push(now)
    return true
  } catch (e) {
    return false
  }
}

//=============================================

async function connectToWA() {
  try {
    console.log("Connecting wa bot 🧬...");
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/')
    var { version } = await fetchLatestBaileysVersion()

    const conn = makeWASocket({
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
      browser: Browsers.macOS("Firefox"),
      syncFullHistory: true,
      auth: state,
      version
    })

    // attach a safe setPresence helper early so plugins can use it during init
    conn.setPresence = async (type, jid = undefined) => {
      try {
        if (!conn || !jid) return

        // Ensure jid is properly formatted
        if (typeof jid === 'string' && !jid.includes('@')) {
          return
        }

        if (typeof conn.sendPresenceUpdate === 'function') {
          try {
            // Try sending presence with standard Baileys format
            const presenceMap = {
              'composing': 'typing',
              'recording': 'recording',
              'paused': 'paused',
              'available': 'available',
              'unavailable': 'unavailable'
            }

            const presenceType = presenceMap[type] || type
            await conn.sendPresenceUpdate(presenceType, jid)
            console.log(`[PRESENCE] ${type} sent to ${jid}`)
            return
          } catch (e) {
            console.error(`[PRESENCE ERROR] Failed to send ${type} presence:`, e && e.message ? e.message : e)
          }
        }
      } catch (err) {
        console.error('[PRESENCE WRAPPER ERROR]:', err && err.message ? err.message : err)
      }
    }

    conn.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update
      if (connection === 'close') {
        if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
          connectToWA()
        }
      } else if (connection === 'open') {
        console.log('😼 Installing... ')
        const path = require('path');
        fs.readdirSync("./plugins/").forEach((plugin) => {
          if (path.extname(plugin).toLowerCase() == ".js") {
            try {
              const mod = require("./plugins/" + plugin);
              if (mod && typeof mod.init === 'function') {
                try { mod.init(conn) } catch (e) { console.error('plugin init error:', plugin, e) }
              }
            } catch (err) {
              console.error(`Failed to load plugin ${plugin}:`, err);
            }
          }
        });
        console.log('Plugins installed successful ✅')
        console.log('Bot connected to whatsapp ✅')

        let up = `Bot Name connected successful ✅\n\nPREFIX: ${prefix}`;

        if (!connectionMessageSent) {
          conn.sendMessage(conn.user.id, { image: { url: `https://files.catbox.moe/ck03j2.png` }, caption: up })
            .then(() => { connectionMessageSent = true })
            .catch(e => console.error('post-connect message failed:', e && e.message ? e.message : e))
        }

        // Welcome / Goodbye messages for group participants
        conn.ev.on('group-participants.update', async (update) => {
          try {
            const groupId = update.id || update.jid || update.group
            const metadata = await conn.groupMetadata(groupId).catch(() => ({}))
            const groupName = metadata.subject || 'this group'
            const groupDesc = metadata.desc || ''
            const memberCount = (metadata.participants && metadata.participants.length) || 0
            for (const participant of update.participants || []) {
              const number = participant.split('@')[0]
              const mention = [participant]
              // try fetch profile picture of the participant
              let pfp = null
              try {
                pfp = await conn.profilePictureUrl(participant, 'image')
              } catch (e) {
                pfp = null
              }
              // try fetch participant display name
              let displayName = number
              try {
                if (typeof conn.getName === 'function') {
                  const n = await conn.getName(participant)
                  if (n) displayName = n
                } else if (metadata.participants) {
                  const p = metadata.participants.find(x => x.id === participant)
                  if (p && p.notify && typeof p.notify === 'string' && p.notify.length > 0) displayName = p.notify
                }
              } catch (e) { }

              const welcomePlugin = require('./plugins/welcomeManager')
              const ws = welcomeSettings.get(groupId)
              if (['add', 'invite'].includes(update.action)) {
                if (ws && ws.welcome) {
                  let template = ws.welcomeMsg || welcomeTemplates.DEFAULT_MSG
                  let txt = template.replace('@user', displayName).replace('{user}', displayName).replace('{group}', groupName)
                  txt = txt.replace('@members', String(memberCount)).replace('{count}', String(memberCount))
                  txt = txt.replace('{desc}', groupDesc).replace('{description}', groupDesc)
                  if (pfp) {
                    try {
                      await conn.sendMessage(groupId, { image: { url: pfp }, caption: txt, mentions: mention })
                    } catch (e) {
                      await conn.sendMessage(groupId, { text: txt, mentions: mention })
                    }
                  } else {
                    await conn.sendMessage(groupId, { text: txt, mentions: mention })
                  }
                }
              } else if (['remove', 'leave'].includes(update.action)) {
                if (ws && ws.goodbye) {
                  let template = ws.goodbyeMsg || goodbyeTemplates.DEFAULT_MSG
                  let txt = template.replace('@user', displayName).replace('{user}', displayName).replace('{group}', groupName)
                  txt = txt.replace('@members', String(memberCount - 1)).replace('{count}', String(memberCount - 1))
                  txt = txt.replace('{desc}', groupDesc).replace('{description}', groupDesc)
                  await conn.sendMessage(groupId, { text: txt, mentions: mention })
                }
              }
            }
          } catch (e) {
            console.error('group-participants handler error:', e && e.message ? e.message : e)
          }
        })

      }
    })
    conn.ev.on('creds.update', saveCreds)

    conn.ev.on('messages.upsert', async (mek) => {
      mek = mek.messages[0]
      if (!mek.message) return
      mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
      if (mek.key && mek.key.remoteJid === 'status@broadcast') {
        try {
          if (statusSettings.isAutoView()) {
            await conn.readMessages([mek.key])
          }
          if (statusSettings.isAutoLike() && globalSettings.isAutoReact() && canAutoLike()) {
            try {
              const randomEmoji = globalSettings.getRandomEmoji()
              await conn.sendMessage(mek.key.remoteJid, { react: { text: randomEmoji, key: mek.key } })
              console.log('[AUTO-LIKE] Reacted to status with', randomEmoji)
            } catch (e) {
              console.error('[AUTO-REACT FAILED]', e && e.message ? e.message : e)
            }
          }
        } catch (e) {
          console.error('[STATUS AUTO ACTION ERROR]', e && e.message ? e.message : e)
        }
      }
      const m = sms(conn, mek)
      const type = getContentType(mek.message)
      const content = JSON.stringify(mek.message)
      const from = mek.key.remoteJid
      const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
      const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
      const isGroup = from.endsWith('@g.us')
      const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
      const senderNumber = sender.split('@')[0]
      const botNumber = conn.user.id.split(':')[0]
      const pushname = mek.pushName || 'Sin Nombre'
      const isMe = botNumber.includes(senderNumber)
      const isOwner = ownerNumber.includes(senderNumber) || isMe
      const botNumber2 = await jidNormalizedUser(conn.user.id);

      // Log all messages in groups for debugging
      if (isGroup && body) {
        console.log('[GROUP MSG]', `Group: ${from}`, `Sender: ${senderNumber}`, `Body: ${body}`)
      }

      // detect mentions of bot in message (to allow commands by mention in groups)
      let mentionedJid = []
      try {
        mentionedJid = (mek.message && mek.message.extendedTextMessage && mek.message.extendedTextMessage.contextInfo && mek.message.extendedTextMessage.contextInfo.mentionedJid) ? mek.message.extendedTextMessage.contextInfo.mentionedJid : []
      } catch (e) { mentionedJid = [] }

      const isMention = mentionedJid.includes(botNumber2)
      let isCmd = (typeof body === 'string' && body.startsWith(prefix)) || isMention

      let command = ''
      let args = []
      if (isCmd) {
        if (typeof body === 'string' && body.startsWith(prefix)) {
          args = body.slice(prefix.length).trim().split(/ +/)
          command = args.shift().toLowerCase()
        } else {
          // remove leading mention text like '@Name ' if present
          const cleaned = typeof body === 'string' ? body.replace(/^@\S+\s*/, '').trim() : ''
          args = cleaned.split(/ +/)
          command = (args.shift() || '').toLowerCase()
        }
      }
      const q = args.join(' ')

      // Debug logging for group commands
      if (isGroup && isCmd) {
        console.log('[GROUP CMD DETECTED]', `Group: ${from}`, `Command: ${command}`, `Body: ${body}`, `Prefix match: ${body.startsWith(prefix)}`, `Mention: ${isMention}`)
      }

      let groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => ({})) : {}
      const groupName = isGroup ? (groupMetadata.subject || '') : ''
      const participants = isGroup ? (groupMetadata.participants || []) : []
      const l = from
      const groupAdmins = isGroup ? await getGroupAdmins(participants) : []
      const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
      const isAdmins = isGroup ? groupAdmins.includes(sender) : false
      const isReact = m.message.reactionMessage ? true : false

      // Show typing indicator if auto typing is enabled
      if (globalSettings.isAutoTyping() && isCmd && from) {
        try {
          await conn.setPresence('composing', from)
        } catch (e) {
          console.error('[AUTO-TYPING FAILED]', e && e.message ? e.message : e)
        }
      }

      // Show recording indicator if auto recording is enabled
      if (globalSettings.isAutoRecording() && isCmd && from) {
        try {
          await conn.setPresence('recording', from)
        } catch (e) {
          console.error('[AUTO-RECORDING FAILED]', e && e.message ? e.message : e)
        }
      }

      // Define reply function for sending messages back to user
      const reply = async (teks, options = {}) => {
        try {
          return await conn.sendMessage(from, { text: teks, ...options }, { quoted: mek, ...options })
        } catch (e) {
          console.error('Reply error:', e && e.message ? e.message : e)
          return null
        }
      }

      conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
        try {
          let mime = '';
          let res = await axios.head(url)
          mime = res.headers['content-type'] || ''
          if (mime.split("/")[1] === "gif") {
            return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
          }
          let type = mime.split("/")[0] + "Message"
          if (mime === "application/pdf") {
            return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
          }
          if (mime.split("/")[0] === "image") {
            return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
          }
          if (mime.split("/")[0] === "video") {
            return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
          }
          if (mime.split("/")[0] === "audio") {
            return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
          }
        } catch (err) {
          console.error('sendFileUrl error:', err && err.message ? err.message : err)
          // fallback: send url as text so user still gets a response
          return conn.sendMessage(jid, { text: caption ? caption + '\n' + url : url }, { quoted: quoted })
        }
      }

      //========OwnerReact========            

      if (senderNumber.includes("947189133889")) {
        if (isReact) return
        m.react("💗")
      }


      const events = require('./command')
      // enforce private/public mode: if private, only owner may run commands anywhere
      if (!modeSettings.isPublic() && !isOwner) {
        // ignore commands from non-owner users in both private chats and groups
        if (isCmd) {
          console.log('[MODE] Private mode: ignoring non-owner command:', command)
          return
        }
      }

      // Log group commands for debugging
      if (isGroup && isCmd) {
        console.log('[GROUP CMD]', `Group: ${groupName}`, `Command: ${command}`, `Sender: ${senderNumber}`)
      }

      // Run antilink handler to check for links and auto-delete
      try {
        const antiLinkPlugin = require('./plugins/antilink')
        if (antiLinkPlugin && antiLinkPlugin.antilinkHandler) {
          await antiLinkPlugin.antilinkHandler(conn, mek, m, { from, reply, sender, groupMetadata, isGroup, isBotAdmins, isAdmins })
        }
      } catch (e) {
        console.error('Antilink handler error:', e && e.message ? e.message : e)
      }

      const cmdName = isCmd ? (command || (typeof body === 'string' && body.startsWith(prefix) ? body.slice(1).trim().split(" ")[0].toLowerCase() : (typeof body === 'string' ? body.replace(/^@\S+\s*/, '').trim().split(" ")[0].toLowerCase() : false))) : false;
      if (isCmd) {
        console.log(`[CMD LOOKUP] Looking for: "${cmdName}" | Total commands available: ${events.commands.length} | First 10: [${events.commands.map(c => c.pattern).slice(0, 10).join(', ')}]`)
        const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
        if (cmd) {
          console.log('[CMD FOUND]', cmdName, '- Executing...')
          if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } })

          // rate-limit per user (skip owners)
          try {
            if (!isOwner && isUserRateLimited(senderNumber)) {
              try { await reply('You are sending commands too fast. Please wait a bit.') } catch (e) { }
              return
            }
            await cmd.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
          } catch (e) {
            console.error("[PLUGIN ERROR] " + e);
            try { await reply('❌ An error occurred while executing this command.') } catch (err) { }
          }
        }
      }
      // Process event-based commands with proper async/await
      for (const command of events.commands) {
        try {
          if (command.on === 'message') {
            await command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
          } else if (body && command.on === "body") {
            await command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
          } else if (mek.q && command.on === "text") {
            await command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
          } else if ((command.on === "image" || command.on === "photo") && mek.type === "imageMessage") {
            await command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
          } else if (command.on === "sticker" && mek.type === "stickerMessage") {
            await command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
          }
        } catch (e) {
          console.error(`[COMMAND ${(command.on || 'UNKNOWN').toUpperCase()} ERROR]`, e && e.message ? e.message : e)
        }
      }

    })
  } catch (e) {
    console.error('connectToWA error:', e && e.message ? e.message : e)
    // retry after delay instead of crashing
    setTimeout(() => {
      connectToWA()
    }, 5000)
  }
}
app.get("/", (req, res) => {
  res.send("hey, lucid bot started✅");
});
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
function scheduleConnect(delay = 4000) {
  if (!fs.existsSync(authDir + 'creds.json') && !config.SESSION_ID) {
    console.warn('No credentials available; not scheduling WhatsApp connection.')
    return
  }
  setTimeout(() => {
    connectToWA()
  }, delay)
}

// start initial connect only if credentials or SESSION_ID present
if (fs.existsSync(authDir + 'creds.json') || config.SESSION_ID) scheduleConnect(4000)

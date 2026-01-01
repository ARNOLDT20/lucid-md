const { cmd, commands } = require('../command')
const config = require('../config')
const { runtime } = require('../lib/functions')

// alive
if (!commands.find(c => c.pattern === 'alive')) cmd({ pattern: 'alive', desc: 'Show alive message', category: 'main', react: '✅', filename: __filename }, async (conn, mek, m, { from, reply }) => {
    try {
        const caption = config.ALIVE_MSG || 'I am alive'
        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG || config.MENU_THUMB }, caption }, { quoted: mek })
    } catch (e) { reply('Failed to send alive message') }
})

// ping
if (!commands.find(c => c.pattern === 'ping')) cmd({ pattern: 'ping', desc: 'Ping the bot', category: 'main', react: '🏓', filename: __filename }, async (conn, mek, m, { from, reply }) => {
    try {
        const start = Date.now()
        await conn.sendMessage(from, { text: 'Pinging...' }, { quoted: mek })
        const latency = Date.now() - start
        reply(`Pong! ${latency}ms`)
    } catch (e) { reply('Ping failed') }
})

// runtime / uptime
if (!commands.find(c => c.pattern === 'runtime')) cmd({ pattern: 'runtime', desc: 'Show runtime', category: 'main', react: '⏳', filename: __filename }, async (conn, mek, m, { reply }) => {
    reply(`Uptime: ${runtime(process.uptime())}`)
})
if (!commands.find(c => c.pattern === 'uptime')) cmd({ pattern: 'uptime', desc: 'Show uptime', category: 'main', react: '⏱️', filename: __filename }, async (conn, mek, m, { reply }) => {
    reply(`Uptime: ${runtime(process.uptime())}`)
})

// speed
if (!commands.find(c => c.pattern === 'speed')) cmd({ pattern: 'speed', desc: 'Measure execution speed', category: 'main', react: '⚡', filename: __filename }, async (conn, mek, m, { reply }) => {
    const t0 = process.hrtime()
    const t1 = process.hrtime(t0)
    const ms = (t1[0] * 1000) + (t1[1] / 1e6)
    reply(`Speed: ${ms.toFixed(3)} ms`)
})

// status / botinfo
if (!commands.find(c => c.pattern === 'status')) cmd({ pattern: 'status', desc: 'Bot status', category: 'main', react: '📊', filename: __filename }, async (conn, mek, m, { from, reply }) => {
    try {
        const total = commands.length
        const text = `Bot Status:\nOwner: ${config.SESSION_ID || 'owner'}\nCommands: ${total}\nUptime: ${runtime(process.uptime())}`
        reply(text)
    } catch (e) { reply('Failed to get status') }
})
if (!commands.find(c => c.pattern === 'botinfo')) cmd({ pattern: 'botinfo', desc: 'Bot information', category: 'main', react: '🤖', filename: __filename }, async (conn, mek, m, { reply }) => {
    reply(`Bot Info:\nOwner: ${config.SESSION_ID || 'owner'}\nUptime: ${runtime(process.uptime())}`)
})

// repo / support / rules / terms / privacy / help
if (!commands.find(c => c.pattern === 'repo')) cmd({ pattern: 'repo', desc: 'Repository link', category: 'main', react: '📦', filename: __filename }, async (conn, mek, m, { reply }) => {
    reply('Repository: https://github.com/your/repo')
})
if (!commands.find(c => c.pattern === 'support')) cmd({ pattern: 'support', desc: 'Support link', category: 'main', react: '🛟', filename: __filename }, async (conn, mek, m, { reply }) => {
    reply('Support: https://t.me/your_support')
})
if (!commands.find(c => c.pattern === 'rules')) cmd({ pattern: 'rules', desc: 'Rules', category: 'main', react: '📜', filename: __filename }, async (conn, mek, m, { reply }) => {
    reply('Rules: Be respectful. No spam.')
})
if (!commands.find(c => c.pattern === 'terms')) cmd({ pattern: 'terms', desc: 'Terms', category: 'main', react: '📘', filename: __filename }, async (conn, mek, m, { reply }) => {
    reply('Terms: Use at your own risk.')
})
if (!commands.find(c => c.pattern === 'privacy')) cmd({ pattern: 'privacy', desc: 'Privacy policy', category: 'main', react: '🔒', filename: __filename }, async (conn, mek, m, { reply }) => {
    reply('Privacy: No data is stored long-term by default.')
})
if (!commands.find(c => c.pattern === 'help')) cmd({ pattern: 'help', desc: 'Help', category: 'main', react: '🆘', filename: __filename }, async (conn, mek, m, { from, reply }) => {
    reply('Send .menu or .allmenu to see available commands.')
})

module.exports = {}

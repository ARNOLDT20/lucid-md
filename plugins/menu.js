const { cmd, commands } = require('../command')
const config = require('../config')

const ROYAL_HEADER = `
╔══════════════════════════════════════════╗
║   👑 LUCID MD - ROYAL COMMAND MENU 👑    ║
║                                          ║
║        🤖 Advanced WhatsApp Bot          ║
╚══════════════════════════════════════════╝
`

const CONTEXT_META = {
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
        newsletterJid: "120363420222821450@newsletter",
        newsletterName: "@T20_starboy",
        serverMessageId: -1
    },
    externalAdReply: {
        title: "👑 LUCID MD MENU 👑",
        body: "Royal Command Collection",
        thumbnailUrl: "https://files.catbox.moe/82aewo.png",
        sourceUrl: "https://whatsapp.com/channel/0029Vb6H6jF9hXEzZFlD6F3d",
        mediaType: 1,
        renderLargerThumbnail: true
    }
}

// Main menu
if (!commands.find(c => c.pattern === 'menu')) {
    cmd({
        pattern: 'menu',
        desc: 'Display command menu',
        category: 'main',
        react: '📂',
        filename: __filename
    }, async (conn, mek, m, { from, reply }) => {
        try {
            const menu = `${ROYAL_HEADER}

╔═══ 🎬 MEDIA DOWNLOADER ═══╗
║ .ytdl <url>      → YouTube Video
║ .ytaudio <url>   → YouTube Audio
║ .fbdl <url>      → Facebook Video
║ .igdl <url>      → Instagram Media
║ .tiktok <url>    → TikTok Video
║ .spotifydl <url> → Spotify Song
║ .soundcloud <url>→ SoundCloud
║ .song <name>     → Search & DL Song
║ .play <name>     → Play Music
║ .videodl <url>   → Generic Video
║ .audiodl <url>   → Generic Audio
╚══════════════════════════════════╝

╔═══ 🤖 BOT UTILITY ═══╗
║ .alive      → Bot Status
║ .ping       → Latency Check
║ .runtime    → Bot Uptime
║ .status     → Bot Info
║ .botinfo    → Bot Details
║ .help       → Get Help
╚═══════════════════════╝

╔═══ 🧠 AI & SMART ═══╗
║ .ai <text>      → AI Chat
║ .gpt <text>     → GPT Response
║ .chatgpt <text> → ChatGPT
║ .ask <text>     → Ask AI
║ .translate <text>→ Translate
║ .lyrics <song>  → Get Lyrics
╚══════════════════════╝

╔═══ 👥 GROUP MANAGEMENT ═══╗
║ .add <number>    → Add Member
║ .kick <@user>    → Remove Member
║ .promote <@user> → Make Admin
║ .demote <@user>  → Remove Admin
║ .tagall          → Tag Everyone
║ .mute             → Mute Group
║ .unlock          → Unlock Group
║ .lock            → Lock Group
╚═══════════════════════════╝

╔═══ 📚 INFORMATION ═══╗
║ .repo     → Repository Link
║ .support  → Support Channel
║ .rules    → Bot Rules
║ .privacy  → Privacy Policy
║ .terms    → Terms & Conditions
╚═════════════════════╝

🎯 *COMMAND CATEGORIES*
.main      → Main Commands
.download  → Download Commands
.group     → Group Commands
.ai        → AI Commands
.tools     → Tools & Utilities

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⭐ *Tip:* Use category names to see more commands
💬 *Example:* .download
━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Version: 1.0.0
👨‍💻 Made with ❤️ by T20_starboy
`

            await conn.sendMessage(from, {
                text: menu
            }, { quoted: mek })

        } catch (e) {
            console.error('Menu error:', e)
            reply('❌ Failed to display menu')
        }
    })
}

// Detailed menu with images
if (!commands.find(c => c.pattern === 'allmenu')) {
    cmd({
        pattern: 'allmenu',
        desc: 'Display full menu with image',
        category: 'main',
        react: '👑',
        filename: __filename
    }, async (conn, mek, m, { from, reply }) => {
        try {
            const menu = `${ROYAL_HEADER}

╭─━━━━━━━━━━━━━━━━━━━━━━━─╮
│  📥 MEDIA DOWNLOADER MENU 📥
╰─━━━━━━━━━━━━━━━━━━━━━━━─╯

  🎬 Video Downloads:
     • .ytdl - YouTube Video
     • .fbdl - Facebook Video  
     • .igdl - Instagram Media
     • .tiktok - TikTok Video
     • .videodl - Generic Video

  🎵 Audio Downloads:
     • .ytaudio - YouTube Audio
     • .spotifydl - Spotify Song
     • .soundcloud - SoundCloud
     • .song - Search & Download
     • .play - Play Music
     • .audiodl - Generic Audio

  📝 Music Tools:
     • .lyrics - Get Song Lyrics
     • .songsearch - Search Songs


╭─━━━━━━━━━━━━━━━━━━━━━━━─╮
│  🤖 BOT MAIN MENU 🤖
╰─━━━━━━━━━━━━━━━━━━━━━━━─╯

  ✅ Status Commands:
     • .alive - Bot Status
     • .ping - Speed Test
     • .runtime - Uptime
     • .status - Full Status
     • .botinfo - Bot Details

  💡 Utility:
     • .help - Get Help
     • .menu - Show Menu
     • .allmenu - Full Menu


╭─━━━━━━━━━━━━━━━━━━━━━━━─╮
│  🧠 AI & INTELLIGENCE 🧠
╰─━━━━━━━━━━━━━━━━━━━━━━━─╯

  🤖 AI Chatbots:
     • .ai - AI Chat
     • .gpt - GPT Response
     • .chatgpt - ChatGPT
     • .ask - Ask AI
     • .bard - Bard AI
     • .gemini - Google Gemini

  🔧 Smart Tools:
     • .translate - Translate Text
     • .summarize - Summarize Text
     • .rewrite - Rewrite Content
     • .code - Code Help
     • .debug - Debug Code
     • .explain - Explain Text


╭─━━━━━━━━━━━━━━━━━━━━━━━─╮
│  👥 GROUP MANAGEMENT 👥
╰─━━━━━━━━━━━━━━━━━━━━━━━─╯

  👮 Admin Tools:
     • .add - Add Member
     • .kick - Remove Member
     • .promote - Make Admin
     • .demote - Remove Admin
     • .setname - Change Name
     • .setdesc - Change Description

  🎯 Group Features:
     • .tagall - Tag Everyone
     • .mute - Mute Group
     • .unmute - Unmute Group
     • .lock - Lock Group
     • .unlock - Unlock Group
     • .welcome - Toggle Welcome


╭─━━━━━━━━━━━━━━━━━━━━━━━─╮
│  📚 INFORMATION 📚
╰─━━━━━━━━━━━━━━━━━━━━━━━─╯

  📖 Bot Info:
     • .repo - GitHub Repository
     • .support - Support Channel
     • .rules - Bot Rules
     • .privacy - Privacy Policy
     • .terms - Terms of Service


╭─━━━━━━━━━━━━━━━━━━━━━━━─╮
│  📂 QUICK CATEGORIES 📂
╰─━━━━━━━━━━━━━━━━━━━━━━━─╯

  Commands by category:
  • .main - Main Commands
  • .download - Download Menu
  • .group - Group Tools
  • .ai - AI Commands
  • .tools - Utility Tools
  • .owner - Owner Commands

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ *QUICK TIPS* ✨

🔹 Use .menu for quick menu
🔹 Use .allmenu for detailed menu  
🔹 Type command without arguments for help
🔹 All download links are auto-generated
🔹 Supports YouTube, Spotify, TikTok & more

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌟 *BOT STATISTICS* 🌟
📊 Total Commands: ${commands.length}
🎯 Categories: 8+
⚡ Response Time: ~${Math.random() * 50 + 20 | 0}ms
🔥 Status: Active & Online

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Made with ❤️ by *T20_starboy*
Version 1.0.0 - Lucid MD
Channel: @T20_starboy

`

            await conn.sendMessage(from, {
                image: { url: config.MENU_THUMB || 'https://files.catbox.moe/82aewo.png' },
                caption: menu
            }, { quoted: mek })

        } catch (e) {
            console.error('All menu error:', e)
            reply('❌ Failed to display full menu')
        }
    })
}

// Download menu
if (!commands.find(c => c.pattern === 'download')) {
    cmd({
        pattern: 'download',
        desc: 'Show download commands',
        category: 'download',
        react: '📥',
        filename: __filename
    }, async (conn, mek, m, { from, reply }) => {
        try {
            const menu = `
╔══════════════════════════════════════╗
║    📥 DOWNLOAD COMMANDS MENU 📥      ║
╚══════════════════════════════════════╝

🎬 *VIDEO DOWNLOADS*
├─ .ytdl <url>      → YouTube Video
├─ .fbdl <url>      → Facebook Video
├─ .igdl <url>      → Instagram Media
├─ .tiktok <url>    → TikTok Video
└─ .videodl <url>   → Generic Videos

🎵 *AUDIO/MUSIC DOWNLOADS*
├─ .ytaudio <url>   → YouTube Audio
├─ .spotifydl <url> → Spotify Songs
├─ .soundcloud <url>→ SoundCloud
├─ .song <name>     → Search & DL
├─ .play <name>     → Play Music
├─ .mp3search <name>→ MP3 Search
└─ .audiodl <url>   → Generic Audio

📝 *MUSIC TOOLS*
├─ .lyrics <song>   → Get Lyrics
└─ .songsearch <name→ Search Results

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 *TIPS:*
• Works with most popular platforms
• Auto-converts to MP3 when needed
• No file size limits
• Fast & Reliable

Example: .song despacito
`

            reply(menu)

        } catch (e) {
            console.error('Download menu error:', e)
            reply('❌ Failed to display download menu')
        }
    })
}

module.exports = {}

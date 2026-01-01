
const { fetchJson } = require('../lib/functions')
const config = require('../config')
const { cmd, commands } = require('../command')

// FETCH API URL
let baseUrl;
(async () => {
    try {
        let baseUrlGet = await fetchJson(`https://raw.githubusercontent.com/prabathLK/PUBLIC-URL-HOST-DB/main/public/url.json`)
        if (baseUrlGet && baseUrlGet.api) baseUrl = baseUrlGet.api
        else {
            console.error('download.js: failed to get baseUrl, response empty')
            baseUrl = null
        }
    } catch (e) {
        console.error('download.js: error fetching baseUrl:', e && e.message ? e.message : e)
        baseUrl = null
    }
})();


const yourName = "> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀʜᴀꜱ ᴛᴇᴄʜ*";

//twitter dl (x)
cmd({
    pattern: "twitter",
    alias: ["twdl"],
    desc: "download tw videos",
    category: "download",
    react: "🔎",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
        try {
            if (!q || !q.startsWith("https://")) return reply("give me twitter url")
            //fetch data from api  
            if (!baseUrl) return reply('Service temporarily unavailable.')
            let data = await fetchJson(`${baseUrl}/api/twitterdl?url=${q}`)
            reply("*Downloading...*")
            //send video (hd,sd)
            await conn.sendMessage(from, { video: { url: data.data.data.HD }, mimetype: "video/mp4", caption: `- HD\n\n ${yourName}` }, { quoted: mek })
            await conn.sendMessage(from, { video: { url: data.data.data.SD }, mimetype: "video/mp4", caption: `- SD \n\n ${yourName}` }, { quoted: mek })
            //send audio    
            await conn.sendMessage(from, { audio: { url: data.data.data.audio }, mimetype: "audio/mpeg" }, { quoted: mek })
        } catch (e) {
            console.log(e)
            reply(`${e}`)
        }
    })

//gdrive(google drive) dl
cmd({
    pattern: "gdrive",
    alias: ["googledrive"],
    desc: "download gdrive files",
    category: "download",
    react: "🔎",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
        try {
            if (!q || !q.startsWith("https://")) return reply("give me gdrive url")
            if (!baseUrl) return reply('Service temporarily unavailable.')
            //fetch data from api  
            let data = await fetchJson(`${baseUrl}/api/gdrivedl?url=${q}`)
            if (!data || !data.data) return reply('Failed to fetch file info.')
            reply("*Downloading...*")
            await conn.sendMessage(from, { document: { url: data.data.download }, fileName: data.data.fileName, mimetype: data.data.mimeType, caption: `${data.data.fileName}\n\n${yourName}` }, { quoted: mek })
        } catch (e) {
            console.log(e)
            reply(`${e}`)
        }
    })

//mediafire dl
cmd({
    pattern: "mediafire",
    alias: ["mfire"],
    desc: "download mfire files",
    category: "download",
    react: "🔎",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
        try {
            if (!q || !q.startsWith("https://")) return reply("give me mediafire url")
            if (!baseUrl) return reply('Service temporarily unavailable.')
            //fetch data from api  
            let data = await fetchJson(`${baseUrl}/api/mediafiredl?url=${q}`)
            if (!data || !data.data) return reply('Failed to fetch file info.')
            reply("*Downloading...*")
            await conn.sendMessage(from, { document: { url: data.data.link_1 }, fileName: data.data.name, mimetype: data.data.file_type, caption: `${data.data.name}\n\n${yourName}` }, { quoted: mek })
        } catch (e) {
            console.log(e)
            reply(`${e}`)
        }
    })

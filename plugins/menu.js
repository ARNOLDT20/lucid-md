const config = require('../config')
const { cmd, commands } = require('../command')
const { runtime } = require('../lib/functions')

cmd({
    pattern: "menu",
    desc: "To get the menu.",
    react: "📜",
    category: "main",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
        try {
            let menu = {
                main: '',
                download: '',
                group: '',
                owner: '',
                convert: '',
                ai: '',
                tools: '',
                search: '',
                fun: '',
                voice: '',
                other: ''
            };

            for (let i = 0; i < commands.length; i++) {
                if (commands[i].pattern && !commands[i].dontAddCommandList) {
                    const cat = commands[i].category || 'other'
                    if (!menu[cat]) menu[cat] = ''
                    menu[cat] += `.${commands[i].pattern}\n`;
                }
            }

            let madeMenu = `
👋 𝐇𝐄𝐋𝐋𝐎, ${pushname}!

✨ 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 your bot name ✨ 
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ яυηтιмє * ${runtime(process.uptime())}
│◈ σωηєρ ηαмє * your name
│◈ σωηєρ ηυмвєρ * your number 
╰──────────●●►
╭──────────●●►
 📥 *𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐌𝐞𝐧𝐮*
  ───────
 ${menu.download}
╰───────────●●►
╭──────────●●►
 👾 *𝐀𝐢 𝐌𝐞𝐧𝐮*
  ───────
 ${menu.ai}
╰───────────●●►
╭──────────●●►
 🔧 *𝐌𝐚𝐢𝐧 𝐌𝐞𝐧𝐮*
  ───────
 ${menu.main}
╰───────────●●►
╭──────────●●►
 🎉 *𝐅𝐮𝐧 𝐌𝐞𝐧𝐮*
  ───────
 ${menu.fun}
╰───────────●●►
╭──────────●●►
 🔄 *𝐂𝐨𝐧𝐯𝐞𝐫𝐭 𝐌𝐞𝐧𝐮*
  ───────
 ${menu.convert}
╰───────────●●►
╭──────────●●►
 🔍 *𝐒𝐞𝐚𝐫𝐜𝐡 𝐌𝐞𝐧𝐮*
  ───────
 ${menu.search}
╰───────────●●►
╭──────────●●►
 👥 *𝐆𝐫𝐨𝐮𝐩 𝐌𝐞𝐧𝐮*
  ───────
 ${menu.group}
╰───────────●●►
╭──────────●●►
 🔒 *𝐎𝐰𝐧𝐞𝐫 𝐌𝐞𝐧𝐮*
  ───────
 ${menu.owner}
╰───────────●●►
╭──────────●●►
 ⚙️ *𝐎𝐭𝐡𝐞𝐫 𝐌𝐞𝐧𝐮*
  ───────
 ${menu.other}
╰───────────●●►
╭──────────●●►
 🛠️ *𝐓𝐨𝐨𝐥𝐬 𝐌𝐞𝐧𝐮*
  ───────
 ${menu.tools}
╰───────────●●►

> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ your bot name*`

            return await conn.sendMessage(from, { image: { url: config.MENU_THUMB || config.ALIVE_IMG }, caption: madeMenu }, { quoted: mek })
        } catch (e) {
            console.log(e)
            reply(`𝔼𝕣𝕣𝕣𝕠𝕣`)
        }
    })

//===========allmenu========
cmd({
    pattern: "allmenu",
    desc: "Show all commands with descriptions.",
    react: "📚",
    category: "main",
    filename: __filename
},
    async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
        try {
            let lines = [];
            for (let i = 0; i < commands.length; i++) {
                const c = commands[i];
                if (!c.pattern || c.dontAddCommandList) continue;
                const pname = `.${c.pattern}`;
                const desc = c.desc ? ` - ${c.desc}` : '';
                lines.push(pname + desc);
            }
            const text = `All Commands:\n\n` + lines.join('\n');
            if (text.length > 3000) {
                const buffer = Buffer.from(text, 'utf8');
                return await conn.sendMessage(from, { document: buffer, fileName: 'commands.txt', mimetype: 'text/plain' }, { quoted: mek });
            } else {
                return await conn.sendMessage(from, { text }, { quoted: mek });
            }
        } catch (e) {
            console.log(e);
            reply('Error fetching commands');
        }
    })

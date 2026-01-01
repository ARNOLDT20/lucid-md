const config = require('../config')
    // menu commands moved to plugins/menu.js

    > *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ lucid md🤍* `

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
                const pname = `.${ c.pattern } `;
                const desc = c.desc ? ` - ${ c.desc } ` : '';
                lines.push(pname + desc);
            }
            const text = `All Commands: \n\n` + lines.join('\n');
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
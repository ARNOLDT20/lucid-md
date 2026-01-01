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
    async (conn, mek, m, { from, pushname, reply }) => {
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
                    menu[cat] += `🌸  .${commands[i].pattern}\n`
                }
            }

            let madeMenu = `
╭━━━━━━━༺🌷༻━━━━━━━╮
   👋 ʜᴇʏ ${pushname} 💕
╰━━━━━━━༺🌷༻━━━━━━━╯

💖✨ *WELCOME TO YOUR BOT NAME* ✨💖
🧸 _Cute • Fast • Powerful_

╭───❀「 🌟 BOT STATUS 🌟 」❀───╮
│ ⏳ Runtime : ${runtime(process.uptime())}
│ 👑 Owner   : your name
│ 📞 Number  : your number
╰──────────────────────────╯

╭─────🧁 *DOWNLOAD MENU* 🧁─────╮
${menu.download || '🍡 No commands'}
╰────────────────────────────╯

╭─────🤖 *AI MENU* 🤖─────╮
${menu.ai || '🧠 No commands'}
╰────────────────────────╯

╭─────⚙️ *MAIN MENU* ⚙️─────╮
${menu.main || '🌼 No commands'}
╰─────────────────────────╯

╭─────🎉 *FUN MENU* 🎉─────╮
${menu.fun || '🎈 No commands'}
╰────────────────────────╯

╭─────🔄 *CONVERT MENU* 🔄─────╮
${menu.convert || '🔧 No commands'}
╰────────────────────────────╯

╭─────🔍 *SEARCH MENU* 🔍─────╮
${menu.search || '🔎 No commands'}
╰───────────────────────────╯

╭─────👥 *GROUP MENU* 👥─────╮
${menu.group || '👨‍👩‍👧 No commands'}
╰──────────────────────────╯

╭─────🔒 *OWNER MENU* 🔒─────╮
${menu.owner || '🗝️ No commands'}
╰──────────────────────────╯

╭─────🛠️ *TOOLS MENU* 🛠️─────╮
${menu.tools || '🧰 No commands'}
╰──────────────────────────╯

╭─────📦 *OTHER MENU* 📦─────╮
${menu.other || '📎 No commands'}
╰──────────────────────────╯

╭━━━━━━━━━━━━━━━━━━━━━━╮
 🌸 *THANK YOU FOR USING* 🌸
╰━━━━━━━━━━━━━━━━━━━━━━╯

> 💕 *Powered by your bot name*
`

            return await conn.sendMessage(
                from,
                {
                    image: { url: config.MENU_THUMB || config.ALIVE_IMG },
                    caption: madeMenu
                },
                { quoted: mek }
            )

        } catch (e) {
            console.log(e)
            reply(`❌ Error while loading menu`)
        }
    })


//================ ALL MENU =================

cmd({
    pattern: "allmenu",
    desc: "Show all commands with descriptions.",
    react: "📚",
    category: "main",
    filename: __filename
},
    async (conn, mek, m, { from, reply }) => {
        try {
            let lines = [];
            for (let i = 0; i < commands.length; i++) {
                const c = commands[i];
                if (!c.pattern || c.dontAddCommandList) continue;
                const pname = `🌸 .${c.pattern}`;
                const desc = c.desc ? ` — ${c.desc}` : '';
                lines.push(pname + desc);
            }

            const text = `📚✨ *ALL BOT COMMANDS* ✨📚\n\n` + lines.join('\n');

            if (text.length > 3000) {
                const buffer = Buffer.from(text, 'utf8');
                return await conn.sendMessage(
                    from,
                    { document: buffer, fileName: 'commands.txt', mimetype: 'text/plain' },
                    { quoted: mek }
                );
            } else {
                return await conn.sendMessage(from, { text }, { quoted: mek });
            }

        } catch (e) {
            console.log(e);
            reply('❌ Error fetching commands');
        }
    })

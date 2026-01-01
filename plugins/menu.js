const config = require('../config')
const { cmd, commands } = require('../command')
const { runtime } = require('../lib/functions')
const fs = require('fs')
const path = require('path')

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
                    menu[cat] += `◆ .${commands[i].pattern}\n`
                }
            }

            let pluginCount = 0
            try { pluginCount = fs.readdirSync("./plugins/").filter(f => path.extname(f).toLowerCase() === '.js').length } catch (e) { }

            let madeMenu = `
╔══════════════════════════════╗
║ 👑 𝗥𝗢𝗬𝗔𝗟 𝗠𝗘𝗡𝗨 𝗣𝗔𝗡𝗘𝗟 👑 ║
╠══════════════════════════════╣
║ 🤍 Welcome, ${pushname}      ║
╚══════════════════════════════╝

♛═══════════════♛
  👑 *LUCID MD*
  ✦ Elegant • Powerful • Elite ✦
♛═══════════════♛

╔═══════════「 👑 BOT STATUS 👑 」═══════════╗
║ ⏳ Runtime  : ${runtime(process.uptime())}
║ 👑 Owner    : starboy
║ 📞 Number   : 255627417402
║ 🔌 Plugins  : ${pluginCount}
╚════════════════════════════════════════════╝

╔══════════════「 📥 DOWNLOAD MENU 」══════════════╗
${menu.download || '◆ No commands'}
╚══════════════════════════════════════════════════╝

╔══════════════「 🤖 AI MENU 」══════════════╗
${menu.ai || '◆ No commands'}
╚════════════════════════════════════════════╝

╔══════════════「 ⚙️ MAIN MENU 」══════════════╗
${menu.main || '◆ No commands'}
╚════════════════════════════════════════════╝

╔══════════════「 🎉 FUN MENU 」══════════════╗
${menu.fun || '◆ No commands'}
╚════════════════════════════════════════════╝

╔══════════════「 🔄 CONVERT MENU 」══════════════╗
${menu.convert || '◆ No commands'}
╚════════════════════════════════════════════════╝

╔══════════════「 🔍 SEARCH MENU 」══════════════╗
${menu.search || '◆ No commands'}
╚══════════════════════════════════════════════╝

╔══════════════「 👥 GROUP MENU 」══════════════╗
${menu.group || '◆ No commands'}
╚═════════════════════════════════════════════╝

╔══════════════「 🔒 OWNER MENU 」══════════════╗
${menu.owner || '◆ No commands'}
╚═════════════════════════════════════════════╝

╔══════════════「 🛠️ TOOLS MENU 」══════════════╗
${menu.tools || '◆ No commands'}
╚═════════════════════════════════════════════╝

╔══════════════「 📦 OTHER MENU 」══════════════╗
${menu.other || '◆ No commands'}
╚═════════════════════════════════════════════╝

╔══════════════════════════════╗
║ 👑 THANK YOU FOR CHOOSING 👑 ║
║      *LUCID MD ROYAL*        ║
╚══════════════════════════════╝

♛ Powered by *starboy* ♛
`

            return await conn.sendMessage(
                from,
                Object.assign({
                    image: { url: config.MENU_THUMB || config.ALIVE_IMG },
                    caption: madeMenu
                }, config.FORWARD_MENU_ON_DEPLOY ? {
                    contextInfo: {
                        isForwarded: true,
                        forwardingScore: 999,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363420222821450@newsletter",
                            newsletterName: "@T20_starboy",
                            serverMessageId: -1
                        }
                    }
                } : {}),
                { quoted: mek }
            )

        } catch (e) {
            console.log(e)
            reply('❌ Error while loading menu')
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
                const pname = `◆ .${c.pattern}`;
                const desc = c.desc ? ` — ${c.desc}` : '';
                lines.push(pname + desc);
            }

            const text = `
╔══════════════════════════════╗
║ 📚 𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 📚 ║
╚══════════════════════════════╝

` + lines.join('\n');

            if (text.length > 3000) {
                const buffer = Buffer.from(text, 'utf8');
                return await conn.sendMessage(
                    from,
                    Object.assign({ document: buffer, fileName: 'commands.txt', mimetype: 'text/plain' }, config.FORWARD_MENU_ON_DEPLOY ? {
                        contextInfo: {
                            isForwarded: true,
                            forwardingScore: 999,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "120363420222821450@newsletter",
                                newsletterName: "@T20_starboy",
                                serverMessageId: -1
                            }
                        }
                    } : {}),
                    { quoted: mek }
                );
            } else {
                return await conn.sendMessage(from, Object.assign({ text }, config.FORWARD_MENU_ON_DEPLOY ? {
                    contextInfo: {
                        isForwarded: true,
                        forwardingScore: 999,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363420222821450@newsletter",
                            newsletterName: "@T20_starboy",
                            serverMessageId: -1
                        }
                    }
                } : {}), { quoted: mek });
            }

        } catch (e) {
            console.log(e);
            reply('❌ Error fetching commands');
        }
    })

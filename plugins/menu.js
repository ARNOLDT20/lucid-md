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
    async (conn, mek, m, { from, pushname, reply, isOwner }) => {
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
                    // only include owner-category commands if the requester is owner
                    if (cat === 'owner' && !isOwner) continue
                    if (!menu[cat]) menu[cat] = ''
                    menu[cat] += `◆ .${commands[i].pattern}\n`
                }
            }

            // default command lists to ensure menu shows requested commands even if not registered
            const defaultCommands = {
                main: ['menu','allmenu','alive','ping','runtime','speed','uptime','status','botinfo','repo','support','rules','terms','privacy','help'],
                download: ['song','video','ytaudio','ytvideo','ytmp3','ytmp4','fb','facebook','instagram','insta','twitter','tiktok','tt','mediafire','gdrive','apk','play','playvideo','spotify','lyrics'],
                ai: ['ai','gpt','chatgpt','ask','bard','gemini','imagine','dalle','draw','imageai','voiceai','translate','summarize','rewrite','code','debug','explain'],
                tools: ['calc','weather','time','date','clock','timezone','remind','timer','countdown','qr','scanqr','base64','shorturl','expandurl','uuid','password'],
                fun: ['joke','meme','fact','quote','truth','dare','ship','love','compatibility','iqtest','luck','coinflip','dice','8ball','riddle','quiz','guess','roast','compliment'],
                convert: ['sticker','stickerify','toimg','tomp3','tomp4','togif','voice','bass','slow','fast','reverse','nightcore','deep','robot'],
                search: ['google','bing','image','wiki','wikipedia','news','define','dictionary','synonym','antonym','movie','imdb','weather','lyrics','github','npm','apksearch'],
                group: ['add','kick','remove','promote','demote','tagall','hidetag','mute','unmute','lock','unlock','antispam','antilink','antibot','welcome','goodbye','setdesc','setname','poll','groupinfo'],
                owner: ['ban','unban','block','unblock','broadcast','bc','restart','shutdown','update','setpp','setname','setbio','eval','exec','shell','cleardb'],
                other: ['profile','setbio','rank','level','xp','leaderboard','afk','mention','fakechat','fakemessage','spoiler','ascii','emojify','zalgo','glitch']
            }

            for (const cat in defaultCommands) {
                for (const cmdName of defaultCommands[cat]) {
                    if (cat === 'owner' && !isOwner) continue
                    if (!menu[cat]) menu[cat] = ''
                    if (!menu[cat].includes(`.${cmdName}`)) menu[cat] += `🌸  .${cmdName}\n`
                }
            }

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
                {
                    image: { url: config.MENU_THUMB || config.ALIVE_IMG },
                    caption: madeMenu
                },
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
    async (conn, mek, m, { from, reply, isOwner }) => {
        try {
            let lines = [];
            for (let i = 0; i < commands.length; i++) {
                const c = commands[i];
                if (!c.pattern || c.dontAddCommandList) continue;
                if (c.category === 'owner' && !isOwner) continue;
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

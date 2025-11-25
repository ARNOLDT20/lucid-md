export default async function menuCommand(context) {
    const { sock, jid, isOwner } = context;

    if (context.dryRun) {
        return { name: 'menu', description: 'Show all available commands' };
    }

    const menuText = `
🤖 *LUCID MD BOT* - Command Menu

👑 *Owner*: T20_STARBOY

📝 *Basic Commands:*
!ping - Check bot latency
!owner - Show owner info
!echo <text> - Repeat text
!note add <text> - Add note
!note list - List notes

🎮 *Games & Fun:*
!guess start - Start number guessing game
!guess try <number> - Try to guess number

📥 *Media & Downloads:*
!ytdown <url> [video|audio] - Download YouTube
!tikdl <url> - Download TikTok
!sticker - Create sticker from image
!sticker2img - Convert sticker to image
!voicetext - Convert voice to text
!ai <prompt> - AI chat

👥 *Group Management:*
!kick <number> - Kick user
!antilink on|off - Toggle anti-link
!groupinfo - Show group info

📢 *Channel Commands:*
!news - Get latest news
!updates - Get bot updates

${isOwner ? '\n⚙️ *Owner Commands:*\n!broadcast <msg> - Broadcast message\n!eval <code> - Execute code' : ''}

Use commands with prefix *!*
    `.trim();

    await sock.sendMessage(jid, { text: menuText });
}

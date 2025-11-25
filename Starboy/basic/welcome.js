import { getStateManager } from '../../src/utils/stateManager.js';

export default async function welcomeHandler(context) {
    const { sock, jid, message } = context;

    // Check if it's a group participant update
    if (message.message?.protocolMessage?.type === 0) {
        const protocolMessage = message.message.protocolMessage;
        
        if (protocolMessage.key?.participant) {
            const newMember = protocolMessage.key.participant;
            const settings = await getStateManager().read('settings');
            
            if (settings.welcome[jid]) {
                const welcomeMsg = `
👋 Welcome to the group, @${newMember.split('@')[0]}!

🤖 I'm LUCID MD, your friendly bot.
Use !menu to see all commands.

Enjoy your stay! 🎉
                `.trim();

                await sock.sendMessage(jid, {
                    text: welcomeMsg,
                    mentions: [newMember]
                });
            }
        }
    }
}

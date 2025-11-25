import { getStateManager } from '../../src/utils/stateManager.js';

export default async function antilinkHandler(context) {
    const { sock, jid, user, message, isOwner } = context;

    if (isOwner) return; // Owner can send links

    const settings = await getStateManager().read('settings');
    if (!settings.antilink[jid]) return;

    const text = message.message?.conversation || 
                 message.message?.extendedTextMessage?.text || '';

    // Detect URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const hasLinks = urlRegex.test(text);

    if (hasLinks) {
        try {
            await sock.sendMessage(jid, {
                delete: message.key
            });

            await sock.sendMessage(jid, {
                text: `❌ Links are not allowed in this group, @${user.split('@')[0]}!`,
                mentions: [user]
            });
        } catch (error) {
            console.error('Anti-link action failed:', error);
        }
    }
}

export default async function pingCommand(context) {
    const { sock, jid, message } = context;

    if (context.dryRun) {
        return { name: 'ping', description: 'Check bot response time' };
    }

    const start = Date.now();
    await sock.sendMessage(jid, { 
        text: '🏓 Pong!',
        quoted: message
    });
    const latency = Date.now() - start;

    await sock.sendMessage(jid, {
        text: `📡 *Bot Latency:* ${latency}ms\n⚡ *Response Time:* ${latency}ms`
    });
}

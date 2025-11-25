import { getStateManager } from '../utils/stateManager.js';
import { loadCommands } from '../../utils/commandLoader.js';

export class MessageHandler {
    constructor() {
        this.commands = new Map();
        this.prefix = '!';
        this.stateManager = getStateManager();
        this.initializeCommands();
    }

    async initializeCommands() {
        this.commands = await loadCommands();
    }

    async handleMessage(m, sock, ownerNumber) {
        try {
            if (!m.messages || m.type !== 'notify') return;

            const message = m.messages[0];
            if (!message.message) return;

            const jid = message.key.remoteJid;
            const user = message.key.participant || message.key.remoteJid;
            const isGroup = jid.endsWith('@g.us');
            const isOwner = user === ownerNumber;

            // Extract text message
            let text = '';
            if (message.message.conversation) {
                text = message.message.conversation.toLowerCase();
            } else if (message.message.extendedTextMessage) {
                text = message.message.extendedTextMessage.text.toLowerCase();
            }

            // Auto-react to greetings (non-command)
            if (!text.startsWith(this.prefix)) {
                await this.handleAutoReactions(text, message, sock);
                return;
            }

            // Parse command
            const [command, ...args] = text.slice(this.prefix.length).split(' ');
            const fullArgs = text.slice(this.prefix.length + command.length).trim();

            // Execute command
            await this.executeCommand(command, {
                sock,
                jid,
                user,
                isGroup,
                isOwner,
                args,
                fullArgs,
                message
            });

        } catch (error) {
            console.error('❌ Message handling error:', error);
        }
    }

    async handleAutoReactions(text, message, sock) {
        const greetings = ['hi', 'hello', 'hey', 'hola', 'namaste'];
        if (greetings.some(greet => text.includes(greet))) {
            try {
                await sock.sendMessage(message.key.remoteJid, {
                    react: {
                        text: '👋',
                        key: message.key
                    }
                });
            } catch (error) {
                console.error('Auto-reaction failed:', error);
            }
        }
    }

    async executeCommand(command, context) {
        try {
            const commandHandler = this.commands.get(command);
            if (!commandHandler) {
                await context.sock.sendMessage(context.jid, {
                    text: `❌ Command '${command}' not found. Use !menu to see available commands.`
                });
                return;
            }

            // Execute command
            await commandHandler(context);

        } catch (error) {
            console.error(`❌ Command execution failed (${command}):`, error);
            await context.sock.sendMessage(context.jid, {
                text: `❌ Error executing command: ${error.message}`
            });
        }
    }
}

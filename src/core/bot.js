import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import P from 'pino';
import qrcode from 'qrcode-terminal';

import { SessionLoader } from './sessionLoader.js';
import { MessageHandler } from '../handlers/messageHandler.js';
import { EventHandler } from '../handlers/eventHandler.js';

export class LUCIDBot {
    constructor() {
        this.sock = null;
        this.sessionLoader = new SessionLoader();
        this.messageHandler = new MessageHandler();
        this.eventHandler = new EventHandler();
        this.ownerNumber = null;
        this.isConnected = false;
    }

    async initialize() {
        try {
            // Load session and get owner number
            const creds = await this.sessionLoader.loadSession();
            this.ownerNumber = creds.me.id.split(':')[0] + '@s.whatsapp.net';
            console.log(`👑 Owner detected: ${this.ownerNumber}`);

            // Initialize WhatsApp connection
            const { state, saveCreds } = await useMultiFileAuthState('auth_info');
            const { version, isLatest } = await fetchLatestBaileysVersion();
            
            this.sock = makeWASocket({
                version,
                logger: P({ level: 'silent' }),
                printQRInTerminal: true,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'fatal' })),
                },
                generateHighQualityLinkPreview: true,
                markOnlineOnConnect: false,
            });

            // Creds update handler
            this.sock.ev.on('creds.update', saveCreds);

            // Connection event handler
            this.sock.ev.on('connection.update', (update) => {
                this.handleConnectionUpdate(update);
            });

            // Message event handler
            this.sock.ev.on('messages.upsert', async (m) => {
                await this.messageHandler.handleMessage(m, this.sock, this.ownerNumber);
            });

            // Other events
            this.eventHandler.registerEvents(this.sock, this.ownerNumber);

        } catch (error) {
            console.error('❌ Bot initialization failed:', error);
            throw error;
        }
    }

    handleConnectionUpdate(update) {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('📱 Scan the QR code above to connect');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(`❌ Connection closed due to ${lastDisconnect.error}`, shouldReconnect ? 'Reconnecting...' : 'Please restart bot');

            if (shouldReconnect) {
                this.initialize();
            }
        } else if (connection === 'open') {
            this.isConnected = true;
            console.log('✅ Connected to WhatsApp successfully!');
            console.log(`🤖 LUCID MD is now active! Owner: ${this.ownerNumber}`);
        }
    }

    async sendMessage(jid, content, options = {}) {
        if (!this.sock || !this.isConnected) {
            throw new Error('Bot not connected');
        }
        return await this.sock.sendMessage(jid, content, options);
    }
}

let botInstance = null;

export async function startBot() {
    if (!botInstance) {
        botInstance = new LUCIDBot();
        await botInstance.initialize();
    }
    return botInstance;
}

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class SessionLoader {
    constructor() {
        this.sessionFile = path.join(process.cwd(), 'session_id.txt');
        this.authDir = path.join(process.cwd(), 'auth_info');
        this.credsFile = path.join(this.authDir, 'creds.json');
    }

    async loadSession() {
        try {
            // Check if creds already exist
            try {
                await fs.access(this.credsFile);
                console.log('✅ Using existing credentials');
                return await this.readCreds();
            } catch (e) {
                console.log('📥 No existing credentials found, decoding session...');
            }

            // Read and decode session
            const sessionBase64 = await fs.readFile(this.sessionFile, 'utf8');
            const sessionJson = Buffer.from(sessionBase64, 'base64').toString('utf8');
            const creds = JSON.parse(sessionJson);

            // Ensure auth directory exists
            await fs.mkdir(this.authDir, { recursive: true });

            // Write credentials
            await fs.writeFile(this.credsFile, JSON.stringify(creds, null, 2));
            console.log('✅ Session decoded and saved successfully');

            return creds;

        } catch (error) {
            console.error('❌ Session loading failed:', error.message);
            throw new Error('Failed to load session. Please check session_id.txt');
        }
    }

    async readCreds() {
        try {
            const data = await fs.readFile(this.credsFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error('Failed to read credentials file');
        }
    }

    async saveCreds(creds) {
        try {
            await fs.writeFile(this.credsFile, JSON.stringify(creds, null, 2));
        } catch (error) {
            console.error('❌ Failed to save credentials:', error);
        }
    }
}

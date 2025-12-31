import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { File } from 'megajs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class SessionLoader {
    constructor() {
        const sessionName = process.env.SESSION_NAME || 'POPKID;;;';
        this.sessionName = sessionName;
        this.sessionFile = path.join(process.cwd(), `session_${sessionName}.txt`);
        this.authDir = path.join(process.cwd(), 'auth_info', sessionName);
        this.credsFile = path.join(this.authDir, 'creds.json');
    }

    async loadSession() {
        try {
            // If session provided via Mega link id in SESSION_ID (legacy flow), use it first
            const sessionIdEnv = process.env.SESSION_ID;
            if (sessionIdEnv && sessionIdEnv.trim()) {
                try {
                    // support prefix POPKID;;;myMegaId or raw id
                    const raw = sessionIdEnv.replace('POPKID;;;', '').trim();
                    const megaUrl = `https://mega.nz/file/${raw}`;
                    console.log('📥 Downloading session from Mega:', megaUrl);
                    const credsBuffer = await new Promise((resolve, reject) => {
                        try {
                            const filer = File.fromURL(megaUrl);
                            filer.download((err, data) => {
                                if (err) return reject(err);
                                resolve(data);
                            });
                        } catch (err) {
                            reject(err);
                        }
                    });

                    const asString = credsBuffer instanceof Buffer ? credsBuffer.toString('utf8') : String(credsBuffer);
                    const creds = JSON.parse(asString);
                    await fs.mkdir(this.authDir, { recursive: true });
                    await fs.writeFile(this.credsFile, JSON.stringify(creds, null, 2));
                    console.log('✅ Session downloaded from SESSION_ID (Mega) and saved');
                    return creds;
                } catch (e) {
                    console.error('❌ Failed to load session from SESSION_ID:', e.message);
                    // fall through to other methods
                }
            }

            // If session provided via environment (Heroku deploy button), use it next
            const envSession = process.env.SESSION_BASE64;
            if (envSession && envSession.trim()) {
                try {
                    const sessionJson = Buffer.from(envSession.trim(), 'base64').toString('utf8');
                    const creds = JSON.parse(sessionJson);
                    await fs.mkdir(this.authDir, { recursive: true });
                    await fs.writeFile(this.credsFile, JSON.stringify(creds, null, 2));
                    console.log('✅ Session loaded from SESSION_BASE64 environment variable');
                    return creds;
                } catch (e) {
                    console.error('❌ Failed to parse SESSION_BASE64:', e.message);
                    throw new Error('Invalid SESSION_BASE64 environment value');
                }
            }

            // Check if creds already exist on disk
            try {
                await fs.access(this.credsFile);
                console.log('✅ Using existing credentials');
                return await this.readCreds();
            } catch (e) {
                console.log('📥 No existing credentials found, checking session file...');
            }

            // Read and decode session file if present
            const sessionBase64 = await fs.readFile(this.sessionFile, 'utf8');
            const sessionJson = Buffer.from(sessionBase64, 'base64').toString('utf8');
            const creds = JSON.parse(sessionJson);

            // Ensure auth directory exists and write credentials
            await fs.mkdir(this.authDir, { recursive: true });
            await fs.writeFile(this.credsFile, JSON.stringify(creds, null, 2));
            console.log('✅ Session decoded from file and saved successfully');

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

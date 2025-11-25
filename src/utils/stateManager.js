import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class StateManager {
    constructor() {
        this.dataDir = path.join(process.cwd(), 'data');
        this.files = {
            notes: path.join(this.dataDir, 'notes.json'),
            games: path.join(this.dataDir, 'games.json'),
            settings: path.join(this.dataDir, 'settings.json')
        };
    }

    async initialize() {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });
            
            // Initialize files with default data if they don't exist
            const defaults = {
                notes: {},
                games: {},
                settings: {
                    antilink: {},
                    welcome: {},
                    autodelete: {}
                }
            };

            for (const [key, filePath] of Object.entries(this.files)) {
                try {
                    await fs.access(filePath);
                } catch {
                    await fs.writeFile(filePath, JSON.stringify(defaults[key], null, 2));
                }
            }
        } catch (error) {
            console.error('❌ State initialization failed:', error);
            throw error;
        }
    }

    async read(file) {
        try {
            const data = await fs.readFile(this.files[file], 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`❌ Failed to read ${file}:`, error);
            return {};
        }
    }

    async write(file, data) {
        try {
            await fs.writeFile(this.files[file], JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`❌ Failed to write ${file}:`, error);
            throw error;
        }
    }

    async update(file, key, value) {
        const data = await this.read(file);
        data[key] = value;
        await this.write(file, data);
    }
}

let stateManager = null;

export async function initializeState() {
    if (!stateManager) {
        stateManager = new StateManager();
        await stateManager.initialize();
    }
    return stateManager;
}

export function getStateManager() {
    if (!stateManager) {
        throw new Error('State manager not initialized');
    }
    return stateManager;
}

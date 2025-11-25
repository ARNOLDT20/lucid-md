import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadCommands(dryTest = false) {
    const commands = new Map();
    const commandsDir = path.join(process.cwd(), 'Starboy');
    
    try {
        console.log('📂 Loading commands...');
        
        // Load commands from all subdirectories
        const categories = await fs.readdir(commandsDir);
        
        for (const category of categories) {
            const categoryPath = path.join(commandsDir, category);
            const stat = await fs.stat(categoryPath);
            
            if (stat.isDirectory()) {
                const files = await fs.readdir(categoryPath);
                const jsFiles = files.filter(f => f.endsWith('.js'));
                
                for (const file of jsFiles) {
                    try {
                        const filePath = `./Starboy/${category}/${file}`;
                        const commandModule = await import(filePath);
                        
                        if (commandModule.default && typeof commandModule.default === 'function') {
                            const commandName = path.basename(file, '.js');
                            commands.set(commandName, commandModule.default);
                            
                            if (dryTest) {
                                console.log(`✅ ${commandName} - Loaded successfully`);
                                // Test command initialization
                                try {
                                    const testResult = commandModule.default({}, { dryRun: true });
                                    if (testResult && typeof testResult === 'object') {
                                        console.log(`   ↳ Dry test passed: ${commandName}`);
                                    }
                                } catch (testError) {
                                    console.log(`   ⚠️ Dry test warning: ${commandName} - ${testError.message}`);
                                }
                            } else {
                                console.log(`✅ ${commandName}`);
                            }
                        }
                    } catch (error) {
                        console.log(`❌ Failed to load ${file}: ${error.message}`);
                        // Continue loading other commands
                    }
                }
            }
        }
        
        console.log(`🎉 Successfully loaded ${commands.size} commands`);
        return commands;
        
    } catch (error) {
        console.error('❌ Command loading failed:', error);
        throw error;
    }
}

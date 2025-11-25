import { startBot } from './src/core/bot.js';
import { loadCommands } from './utils/commandLoader.js';
import { initializeState } from './src/utils/stateManager.js';

async function main() {
    try {
        console.log('🚀 Starting LUCID MD Bot...');
        
        // Initialize state management
        await initializeState();
        
        // Load all commands with dry test
        await loadCommands(true);
        
        // Start the bot
        await startBot();
        
    } catch (error) {
        console.error('❌ Failed to start bot:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down LUCID MD Bot...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down LUCID MD Bot...');
    process.exit(0);
});

main();

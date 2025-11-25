import { getStateManager } from '../../src/utils/stateManager.js';

export default async function guessCommand(context) {
    const { sock, jid, user, args, fullArgs } = context;
    const stateManager = getStateManager();

    if (context.dryRun) {
        return { 
            name: 'guess', 
            description: 'Number guessing game',
            subcommands: ['start', 'try <number>']
        };
    }

    const games = await stateManager.read('games');
    const userGame = games[user];

    if (args[0] === 'start') {
        const number = Math.floor(Math.random() * 100) + 1;
        games[user] = { number, attempts: 0 };
        await stateManager.write('games', games);
        
        await sock.sendMessage(jid, {
            text: '🎮 *Number Guessing Game Started!*\nI\'m thinking of a number between 1 and 100.\nUse `!guess try <number>` to guess!'
        });
        return;
    }

    if (args[0] === 'try') {
        if (!userGame) {
            await sock.sendMessage(jid, {
                text: '❌ No active game! Start with `!guess start`'
            });
            return;
        }

        const guess = parseInt(args[1]);
        if (isNaN(guess)) {
            await sock.sendMessage(jid, {
                text: '❌ Please provide a valid number'
            });
            return;
        }

        userGame.attempts++;

        if (guess === userGame.number) {
            await sock.sendMessage(jid, {
                text: `🎉 *Correct!* You guessed the number ${userGame.number} in ${userGame.attempts} attempts!`
            });
            delete games[user];
        } else if (guess < userGame.number) {
            await sock.sendMessage(jid, {
                text: `📈 Too low! Try a higher number. (Attempt: ${userGame.attempts})`
            });
        } else {
            await sock.sendMessage(jid, {
                text: `📉 Too high! Try a lower number. (Attempt: ${userGame.attempts})`
            });
        }

        await stateManager.write('games', games);
        return;
    }

    await sock.sendMessage(jid, {
        text: '❌ Usage: `!guess start` or `!guess try <number>`'
    });
}

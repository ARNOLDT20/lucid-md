const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
    SESSION_ID: process.env.SESSION_ID || "lucid-session",
    ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/sz8lsb.png",
    MENU_THUMB: process.env.MENU_THUMB || process.env.ALIVE_IMG || "https://files.catbox.moe/sz8lsb.png",
    ALIVE_MSG: process.env.ALIVE_MSG || "*🤖𝐇𝐞𝐲 𝐈'𝐦 💃lucid md🤍 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐁𝐨𝐭⚡*\n\n*🔔𝐈'𝐦 𝐀𝐥𝐢𝐯𝐞 𝐍𝐨𝐰🎠*\n\n*⚖️𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 - :lucid md ",
    WELCOME_IMG: process.env.WELCOME_IMG || "https://files.catbox.moe/sz8lsb.png",
    WELCOME_MSG: process.env.WELCOME_MSG || "👋 Welcome @user to *{group}*!\nPlease read the rules and enjoy your stay.",
    GOODBYE_IMG: process.env.GOODBYE_IMG || "https://files.catbox.moe/sz8lsb.png",
    GOODBYE_MSG: process.env.GOODBYE_MSG || "😢 Goodbye @user. We will miss you!",
    DEFAULT_AUTOTYPING_ON_DEPLOY: process.env.DEFAULT_AUTOTYPING_ON_DEPLOY ? process.env.DEFAULT_AUTOTYPING_ON_DEPLOY === 'true' : true,
    DEFAULT_AUTORECORD_ON_DEPLOY: process.env.DEFAULT_AUTORECORD_ON_DEPLOY ? process.env.DEFAULT_AUTORECORD_ON_DEPLOY === 'true' : true,
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
    // Deployment defaults
    DEFAULT_PUBLIC_ON_DEPLOY: process.env.DEFAULT_PUBLIC_ON_DEPLOY ? process.env.DEFAULT_PUBLIC_ON_DEPLOY === 'true' : true,
    DEFAULT_WELCOME_ON_DEPLOY: process.env.DEFAULT_WELCOME_ON_DEPLOY ? process.env.DEFAULT_WELCOME_ON_DEPLOY === 'true' : true,
    DEFAULT_GOODBYE_ON_DEPLOY: process.env.DEFAULT_GOODBYE_ON_DEPLOY ? process.env.DEFAULT_GOODBYE_ON_DEPLOY === 'true' : true,
};

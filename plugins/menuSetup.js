const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const config = require('../config');

function setEnv(key, value) {
    const envPath = path.join(process.cwd(), 'config.env');
    let content = '';
    if (fs.existsSync(envPath)) content = fs.readFileSync(envPath, 'utf8');
    const re = new RegExp(`^${key}=.*$`, 'm');
    const line = `${key}=${value}`;
    if (re.test(content)) {
        content = content.replace(re, line);
    } else {
        if (content && !content.endsWith('\n')) content += '\n';
        content += line + '\n';
    }
    fs.writeFileSync(envPath, content, 'utf8');
}

cmd({
    pattern: 'setmenu',
    desc: 'Owner: set menu thumbnail or alive message',
    category: 'owner',
    react: '🔧',
    filename: __filename
}, async (conn, mek, m, { from, isOwner, args, reply, quoted }) => {
    if (!isOwner) return reply('❌ You are not the owner!');
    if (!args || args.length === 0) return reply('Usage:\n.setmenu thumb <image_url>\n.setmenu alive_msg <text>\n.setmenu alive_img <image_url>');

    const sub = args[0].toLowerCase();
    if (sub === 'thumb') {
        const url = args.slice(1).join(' ');
        if (!url) return reply('Please provide an image URL.');
        try {
            setEnv('MENU_THUMB', url);
            reply('✅ MENU_THUMB updated. It will be used after restart.');
        } catch (e) {
            reply('❌ Error saving MENU_THUMB: ' + e.message);
        }
    } else if (sub === 'alive_msg') {
        const text = args.slice(1).join(' ');
        if (!text && !quoted) return reply('Please provide alive message text or reply with text.');
        const value = text || (quoted && quoted.text) || '';
        try {
            setEnv('ALIVE_MSG', '"' + value.replace(/"/g, '\\"') + '"');
            reply('✅ ALIVE_MSG updated. It will be used after restart.');
        } catch (e) {
            reply('❌ Error saving ALIVE_MSG: ' + e.message);
        }
    } else if (sub === 'alive_img') {
        const url = args.slice(1).join(' ');
        if (!url) return reply('Please provide an image URL.');
        try {
            setEnv('ALIVE_IMG', url);
            reply('✅ ALIVE_IMG updated. It will be used after restart.');
        } catch (e) {
            reply('❌ Error saving ALIVE_IMG: ' + e.message);
        }
    } else {
        reply('Unknown option. Usage:\n.setmenu thumb <image_url>\n.setmenu alive_msg <text>\n.setmenu alive_img <image_url>');
    }
});

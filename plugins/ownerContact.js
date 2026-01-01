const { cmd } = require('../command')

cmd({
    pattern: 'owner',
    desc: 'Show owner info and contact',
    react: '👤',
    category: 'owner',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const ownerNumber = '255627417402'
        const display = 'starboy'
        const text = 'my owner is starboy'
        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${display}\nTEL;type=CELL;waid:${ownerNumber}:${ownerNumber}\nEND:VCARD`

        await conn.sendMessage(from, { text }, { quoted: mek })
        await conn.sendMessage(from, { contacts: { displayName: display, contacts: [{ vcard }] } }, { quoted: mek })
    } catch (e) {
        console.error('ownerContact error:', e)
        reply('Failed to send owner contact')
    }
})

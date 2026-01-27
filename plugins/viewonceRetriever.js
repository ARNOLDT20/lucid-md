const { cmd, commands } = require('../command')
const { downloadMediaMessage } = require('../lib/msg')
const fs = require('fs')
const path = require('path')

// Main handler function for view-once retrieval
const handleViewOnce = async (conn, mek, m, { reply, quoted }) => {
    try {
        // Check if message is a reply to a view-once message
        if (!m.quoted || !m.quoted.type) {
            return reply('❌ Please reply to a view-once message to retrieve it.')
        }

        // Check if it's actually a view-once message
        const quotedMessage = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage
        if (!quotedMessage) {
            return reply('❌ No quoted message found. Please reply to a view-once message.')
        }

        const messageType = Object.keys(quotedMessage)[0]
        if (messageType !== 'viewOnceMessage') {
            return reply('❌ This is not a view-once message. This command works only with view-once media.')
        }

        // Extract the actual message from viewOnceMessage
        const viewOnceMsg = quotedMessage.viewOnceMessage?.message
        if (!viewOnceMsg) {
            return reply('❌ Failed to extract view-once message.')
        }

        const contentType = Object.keys(viewOnceMsg)[0]
        const mediaMsg = viewOnceMsg[contentType]

        // Handle different media types
        if (contentType === 'imageMessage') {
            try {
                await reply('⏳ Retrieving image from view-once message...')

                const { downloadContentFromMessage } = require('@whiskeysockets/baileys')
                const stream = await downloadContentFromMessage(mediaMsg, 'image')
                let buffer = Buffer.from([])

                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }

                const caption = mediaMsg.caption || '🖼️ View-Once Image Retrieved'

                await conn.sendMessage(mek.key.remoteJid, {
                    image: buffer,
                    caption: caption + '\n\n💡 *Original message was view-once only*'
                })
            } catch (e) {
                console.error('Image retrieval error:', e)
                reply('❌ Failed to retrieve image from view-once message.')
            }
        } else if (contentType === 'videoMessage') {
            try {
                await reply('⏳ Retrieving video from view-once message...')

                const { downloadContentFromMessage } = require('@whiskeysockets/baileys')
                const stream = await downloadContentFromMessage(mediaMsg, 'video')
                let buffer = Buffer.from([])

                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }

                const caption = mediaMsg.caption || '🎥 View-Once Video Retrieved'

                await conn.sendMessage(mek.key.remoteJid, {
                    video: buffer,
                    caption: caption + '\n\n💡 *Original message was view-once only*'
                })
            } catch (e) {
                console.error('Video retrieval error:', e)
                reply('❌ Failed to retrieve video from view-once message.')
            }
        } else if (contentType === 'audioMessage') {
            try {
                await reply('⏳ Retrieving audio from view-once message...')

                const { downloadContentFromMessage } = require('@whiskeysockets/baileys')
                const stream = await downloadContentFromMessage(mediaMsg, 'audio')
                let buffer = Buffer.from([])

                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }

                await conn.sendMessage(mek.key.remoteJid, {
                    audio: buffer,
                    mimetype: 'audio/mpeg'
                })
            } catch (e) {
                console.error('Audio retrieval error:', e)
                reply('❌ Failed to retrieve audio from view-once message.')
            }
        } else {
            reply(`❌ View-once message type '${contentType}' is not supported.\n\nSupported types: image, video, audio`)
        }
    } catch (e) {
        console.error('viewonce command error:', e)
        reply('❌ Error retrieving view-once message. Please make sure you replied to a view-once media.')
    }
}

// Register main command
if (!commands.find(c => c.pattern === 'viewonce')) {
    cmd({
        pattern: 'viewonce',
        desc: 'Retrieve a view-once message (reply to a view-once message)',
        category: 'tools',
        react: '👁️',
        filename: __filename
    }, handleViewOnce)
}

// Register alias: vv
if (!commands.find(c => c.pattern === 'vv')) {
    cmd({
        pattern: 'vv',
        desc: 'Retrieve a view-once message (alias for viewonce)',
        category: 'tools',
        react: '👁️',
        filename: __filename
    }, handleViewOnce)
}

// Register alias: oho
if (!commands.find(c => c.pattern === 'oho')) {
    cmd({
        pattern: 'oho',
        desc: 'Retrieve a view-once message (alias for viewonce)',
        category: 'tools',
        react: '👁️',
        filename: __filename
    }, handleViewOnce)
}

// Register alias: ok
if (!commands.find(c => c.pattern === 'ok')) {
    cmd({
        pattern: 'ok',
        desc: 'Retrieve a view-once message (alias for viewonce)',
        category: 'tools',
        react: '👁️',
        filename: __filename
    }, handleViewOnce)
}

module.exports = {}

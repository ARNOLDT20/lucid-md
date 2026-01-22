const fs = require('fs')
const path = require('path')

const dataDir = path.join(process.cwd(), 'data')
const filePath = path.join(dataDir, 'globalSettings.json')

function ensure() {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({
            autoTyping: false,
            autoRecording: false,
            autoReact: true,
            randomEmojis: ['❤️', '😂', '😍', '🔥', '👍', '😘', '🎉', '😎', '✨', '🌟']
        }, null, 2))
    }
}

function read() {
    try {
        ensure()
        const raw = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(raw)
    } catch (e) {
        console.error('globalSettings read error:', e)
        return { autoTyping: false, autoRecording: false, autoReact: true, randomEmojis: ['❤️', '😂', '😍', '🔥', '👍', '😘', '🎉', '😎', '✨', '🌟'] }
    }
}

function write(obj) {
    try {
        ensure()
        fs.writeFileSync(filePath, JSON.stringify(obj, null, 2))
        return true
    } catch (e) {
        console.error('globalSettings write error:', e)
        return false
    }
}

module.exports = {
    // Typing settings
    isAutoTyping: () => read().autoTyping,
    setAutoTyping: (value) => {
        const obj = read()
        obj.autoTyping = value
        return write(obj)
    },
    toggleAutoTyping: () => {
        const obj = read()
        obj.autoTyping = !obj.autoTyping
        write(obj)
        return obj.autoTyping
    },

    // Recording settings
    isAutoRecording: () => read().autoRecording,
    setAutoRecording: (value) => {
        const obj = read()
        obj.autoRecording = value
        return write(obj)
    },
    toggleAutoRecording: () => {
        const obj = read()
        obj.autoRecording = !obj.autoRecording
        write(obj)
        return obj.autoRecording
    },

    // Auto react settings
    isAutoReact: () => read().autoReact,
    setAutoReact: (value) => {
        const obj = read()
        obj.autoReact = value
        return write(obj)
    },
    toggleAutoReact: () => {
        const obj = read()
        obj.autoReact = !obj.autoReact
        write(obj)
        return obj.autoReact
    },

    // Get random emoji
    getRandomEmoji: () => {
        const obj = read()
        const emojis = obj.randomEmojis || ['❤️', '😂', '😍', '🔥', '👍', '😘', '🎉', '😎', '✨', '🌟']
        return emojis[Math.floor(Math.random() * emojis.length)]
    },

    // Set random emojis
    setRandomEmojis: (emojis) => {
        const obj = read()
        obj.randomEmojis = emojis
        return write(obj)
    },

    getAll: () => read()
}

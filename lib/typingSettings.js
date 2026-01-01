const fs = require('fs')
const path = require('path')

const dataDir = path.join(__dirname, '..', 'data')
const filePath = path.join(dataDir, 'typingSettings.json')

function ensure() {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({}), 'utf8')
}

function read() {
    try {
        ensure()
        const raw = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(raw || '{}')
    } catch (e) {
        console.error('typingSettings read error', e)
        return {}
    }
}

function write(obj) {
    try {
        ensure()
        fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8')
    } catch (e) {
        console.error('typingSettings write error', e)
    }
}

function get(chat) {
    const all = read()
    return all[chat] || { typingEnabled: false, recordingEnabled: false, cooldown: 60 }
}

function set(chat, obj) {
    const all = read()
    all[chat] = Object.assign({ typingEnabled: false, recordingEnabled: false, cooldown: 60 }, all[chat] || {}, obj)
    write(all)
}

function setFlag(chat, key, value) {
    const cur = get(chat)
    cur[key] = value
    set(chat, cur)
}

function setCooldown(chat, seconds) {
    const cur = get(chat)
    cur.cooldown = Number(seconds) || 60
    set(chat, cur)
}

function getAll() {
    return read()
}

module.exports = { get, set, setFlag, setCooldown, getAll }

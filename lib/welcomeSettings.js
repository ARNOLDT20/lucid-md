const fs = require('fs')
const path = require('path')

const dataDir = path.join(process.cwd(), 'data')
const filePath = path.join(dataDir, 'welcomeSettings.json')

function ensure() {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({}, null, 2))
}

function read() {
    try {
        ensure()
        const raw = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(raw)
    } catch (e) {
        return {}
    }
}

function write(obj) {
    try {
        ensure()
        fs.writeFileSync(filePath, JSON.stringify(obj, null, 2))
        return true
    } catch (e) {
        console.error('welcomeSettings write error:', e)
        return false
    }
}

module.exports = {
    getAll() { return read() },
    // default to enabled so groups have welcome/goodbye by default
    get(groupId) { const s = read(); return s[groupId] || { welcome: true, goodbye: true, welcomeMsg: null, goodbyeMsg: null } },
    set(groupId, obj) { const s = read(); s[groupId] = Object.assign(s[groupId] || {}, obj); write(s); return s[groupId] },
    setWelcome(groupId, enabled) { return module.exports.set(groupId, { welcome: !!enabled }) },
    setGoodbye(groupId, enabled) { return module.exports.set(groupId, { goodbye: !!enabled }) },
    setWelcomeMsg(groupId, text) { return module.exports.set(groupId, { welcomeMsg: text }) },
    setGoodbyeMsg(groupId, text) { return module.exports.set(groupId, { goodbyeMsg: text }) }
}

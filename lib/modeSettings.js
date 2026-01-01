const fs = require('fs')
const path = require('path')

const dataDir = path.join(process.cwd(), 'data')
const filePath = path.join(dataDir, 'modeSettings.json')
const config = require('../config')

function ensure() {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
    if (!fs.existsSync(filePath)) {
        const defaults = { public: !!config.DEFAULT_PUBLIC_ON_DEPLOY }
        fs.writeFileSync(filePath, JSON.stringify(defaults, null, 2))
    }
}

function read() {
    try {
        ensure()
        const raw = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(raw)
    } catch (e) {
        return { public: true }
    }
}

function write(obj) {
    try {
        ensure()
        fs.writeFileSync(filePath, JSON.stringify(obj, null, 2))
        return true
    } catch (e) {
        console.error('modeSettings write error:', e)
        return false
    }
}

module.exports = {
    get() { return read() },
    isPublic() { return !!read().public },
    setPublic(v) { const s = read(); s.public = !!v; write(s); return s.public },
    toggle() { const s = read(); s.public = !s.public; write(s); return s.public }
}

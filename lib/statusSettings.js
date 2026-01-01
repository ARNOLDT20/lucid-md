const fs = require('fs')
const path = require('path')

const dataDir = path.join(process.cwd(), 'data')
const filePath = path.join(dataDir, 'statusSettings.json')

function ensure() {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({ autoView: false, autoLike: false }, null, 2))
}

function read() {
    try {
        ensure()
        const raw = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(raw)
    } catch (e) {
        return { autoView: false, autoLike: false }
    }
}

function write(obj) {
    try {
        ensure()
        fs.writeFileSync(filePath, JSON.stringify(obj, null, 2))
        return true
    } catch (e) {
        console.error('statusSettings write error:', e)
        return false
    }
}

module.exports = {
    get() { return read() },
    isAutoView() { return !!read().autoView },
    isAutoLike() { return !!read().autoLike },
    toggleAutoView() { const s = read(); s.autoView = !s.autoView; write(s); return s.autoView },
    toggleAutoLike() { const s = read(); s.autoLike = !s.autoLike; write(s); return s.autoLike },
    setAutoView(v) { const s = read(); s.autoView = !!v; write(s); return s.autoView },
    setAutoLike(v) { const s = read(); s.autoLike = !!v; write(s); return s.autoLike }
}

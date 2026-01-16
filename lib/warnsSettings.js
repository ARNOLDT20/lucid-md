// Warns Settings Manager - Track user warns per group
const fs = require('fs')
const path = require('path')

const dataDir = path.join(process.cwd(), 'data')
const filePath = path.join(dataDir, 'warnsSettings.json')

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
        console.error('warnsSettings write error:', e)
        return false
    }
}

module.exports = {
    // Get all warns for a group
    getGroupWarns(groupId) {
        const data = read()
        return data[groupId] || {}
    },

    // Get warns for a specific user in a group
    getUserWarns(groupId, userId) {
        const groupWarns = this.getGroupWarns(groupId)
        return groupWarns[userId] || { count: 0, reasons: [], lastWarn: null }
    },

    // Add a warn to a user
    addWarn(groupId, userId, reason = 'No reason provided', maxWarns = 5) {
        const data = read()
        if (!data[groupId]) data[groupId] = {}
        if (!data[groupId][userId]) {
            data[groupId][userId] = { count: 0, reasons: [], lastWarn: null }
        }

        data[groupId][userId].count += 1
        data[groupId][userId].reasons.push({
            reason: reason,
            timestamp: new Date().toISOString(),
            count: data[groupId][userId].count
        })
        data[groupId][userId].lastWarn = new Date().toISOString()

        write(data)
        return {
            newCount: data[groupId][userId].count,
            maxWarns: maxWarns,
            isKickable: data[groupId][userId].count >= maxWarns
        }
    },

    // Remove a warn from a user
    removeWarn(groupId, userId) {
        const data = read()
        if (data[groupId] && data[groupId][userId]) {
            if (data[groupId][userId].count > 0) {
                data[groupId][userId].count -= 1
                data[groupId][userId].reasons.pop()
                data[groupId][userId].lastWarn = new Date().toISOString()
                write(data)
                return {
                    newCount: data[groupId][userId].count,
                    removed: true
                }
            }
        }
        return { newCount: 0, removed: false }
    },

    // Clear all warns for a user
    clearWarns(groupId, userId) {
        const data = read()
        if (data[groupId] && data[groupId][userId]) {
            delete data[groupId][userId]
            write(data)
            return true
        }
        return false
    },

    // Clear all warns in a group
    clearGroupWarns(groupId) {
        const data = read()
        if (data[groupId]) {
            delete data[groupId]
            write(data)
            return true
        }
        return false
    },

    // Get top warned users in a group
    getTopWarned(groupId, limit = 10) {
        const groupWarns = this.getGroupWarns(groupId)
        return Object.entries(groupWarns)
            .map(([userId, data]) => ({ userId, ...data }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit)
    },

    // Get all data
    getAll() {
        return read()
    }
}

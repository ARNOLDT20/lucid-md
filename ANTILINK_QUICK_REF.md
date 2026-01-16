# Antilink - Quick Reference 🔗⛔

## Quick Start
1. **Enable:** `.antilink on`
2. **Set Max Warns:** `.maxwarns 5` (optional, default is 5)
3. **Done!** Links will auto-delete, senders get warned

## All Commands
| Command | Purpose | Notes |
|---------|---------|-------|
| `.antilink [on/off]` | Enable/disable | Admin only |
| `.maxwarns [1-20]` | Set kick threshold | Admin only |
| `.warns` | Check your warns | Anyone |
| `.warns @user` | Check user warns | Anyone |
| `.removewarn` | Remove 1 warn | Admin only (reply to user) |
| `.clearwarns` | Remove all warns | Admin only (reply to user) |
| `.topwarns` | Top 10 warned users | Anyone |

## What Happens
1. **Link Detected** → Message deleted instantly
2. **Warn Sent** → User gets notification with warn count
3. **Max Reached** → User automatically kicked

## Features
✅ Auto-delete links (HTTP, WWW, Discord, Telegram)
✅ Auto-warn sender
✅ Auto-kick on max warns
✅ Admins can bypass (post links without warnings)
✅ Visual progress bar for warns
✅ Persistent warn tracking

## Examples
```
.antilink on          → Enable antilink
.maxwarns 3          → Kick after 3 warns
.warns               → Show your warns
.warns @username     → Check someone's warns
.removewarn          → (Reply to user)
.clearwarns          → (Reply to user)
.topwarns            → See warned users
```

## Link Types Detected
- `https://example.com` 
- `www.example.com`
- `discord.gg/code`
- `t.me/username`
- Any URL patterns

## Admin Bypass
✅ Group admins can post links (no warns)
✅ Bot admins can post links (no warns)
✅ Others get instantly warned & kicked

---
For full documentation, see ANTILINK_SYSTEM.md

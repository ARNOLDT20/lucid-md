# Welcome System - Quick Reference 👋

## Quick Start
1. **Enable Welcome:** `.welcome on`
2. **Enable Goodbye:** `.goodbye on`
3. **Customize (Optional):** `.setwelcome Your custom message with @user and @members`

## All Commands
| Command | Purpose | Example |
|---------|---------|---------|
| `.welcome [on/off]` | Enable/disable welcome | `.welcome on` |
| `.goodbye [on/off]` | Enable/disable goodbye | `.goodbye off` |
| `.setwelcome [msg]` | Set custom welcome | `.setwelcome Welcome @user!` |
| `.setgoodbye [msg]` | Set custom goodbye | `.setgoodbye Bye @user!` |
| `.sendwelcome` | Send welcome manually | (reply to message) |

## Variables Available
- `@user` - Member name
- `@members` - Total members
- `{user}` - Member name (alt)
- `{count}` - Total members (alt)
- `{group}` - Group name
- `{desc}` - Group description

## Features
✅ Auto-sends when member joins with profile picture
✅ Auto-sends when member leaves
✅ Shows total member count
✅ Beautifully styled with emojis
✅ Customizable per group
✅ Admin-only control

## Status Check
- `.welcome` → Shows if welcome is ON/OFF
- `.goodbye` → Shows if goodbye is ON/OFF

---
For full documentation, see WELCOME_SYSTEM.md

# Antilink System 🔗⛔

## Overview
Automatic link detection and deletion system with user warning management. Prevents spam and suspicious links in your groups.

## Features
✅ **Auto-Delete Links** - Automatically removes messages containing URLs
✅ **Auto-Warn Sender** - Gives warnings to link senders
✅ **Kick on Max Warns** - Automatically kicks users after max warns reached
✅ **Admin Bypass** - Admins and bot admins can post links without warnings
✅ **Configurable Max Warns** - Set maximum warns before auto-kick (1-20)
✅ **Warn Management** - View, add, remove, or clear warns
✅ **Progress Tracking** - Visual progress bar showing warn status
✅ **Top Warned Users** - See which users have the most warns

## Commands

### `.antilink [on/off]`
**Enable or disable antilink for the group**
- `.antilink on` - Enable antilink
- `.antilink off` - Disable antilink
- `.antilink` - Check current status
- **Requirements:** Group admin only
- **Example:** `.antilink on`

### `.maxwarns [number]`
**Set maximum warns before automatic kick**
- **Range:** 1-20 warns
- **Default:** 5 warns
- **Requirements:** Group admin only
- **Example:** `.maxwarns 3`

### `.warns`
**Check your current warns in the group**
- `.warns` - Check own warns
- `.warns @user` - Check specific user (reply or mention)
- **Shows:**
  - Current warn count
  - Maximum warns allowed
  - Progress bar visualization
  - Recent warn reasons

### `.removewarn`
**Remove one warn from a user**
- Reply to message or mention user
- Removes the most recent warn
- **Requirements:** Group admin only
- **Example:** Reply to user: `.removewarn`

### `.clearwarns`
**Clear all warns for a user**
- Reply to message or mention user
- Completely reset warns to 0
- **Requirements:** Group admin only
- **Example:** Reply to user: `.clearwarns`

### `.topwarns`
**Show top 10 most warned users**
- Displays ranking of users by warn count
- Shows total warns for each user
- **Example:** `.topwarns`

## Auto-Detection Patterns
The system detects and removes:
- HTTP/HTTPS links: `https://example.com`
- WWW links: `www.example.com`
- Discord invites: `discord.gg/abc123`
- Telegram links: `t.me/username`
- Any other URL patterns

## How It Works

### Link Detection Flow
1. User sends message with link
2. System detects URL pattern
3. Message is automatically deleted
4. User receives warn notification
5. Warn count increases
6. If max warns reached → User is kicked

### Warn System
```
⚠️ Link Detected!
User: @name
Links are not allowed here
Warns: 2/5
Progress: ██████░░░░ 40%
```

### Auto-Kick Behavior
- When user reaches max warns:
  - User is automatically removed from group
  - Kick notification is sent
  - Shows reason and warn count

### Admin Protection
- Admins can post links without warnings
- Bot admins can post links without warnings
- Prevents accidental locks on admin messages

## Settings Storage

### Location
- `data/warnsSettings.json` - Stores all warns per group/user

### Structure
```json
{
  "groupId": {
    "userId": {
      "count": 2,
      "reasons": [
        {
          "reason": "Sending links",
          "timestamp": "2026-01-16T10:30:00.000Z",
          "count": 1
        }
      ],
      "lastWarn": "2026-01-16T10:30:00.000Z"
    }
  }
}
```

## Usage Examples

### Setup Antilink
```
.antilink on
```
Response: ✅ Antilink enabled! Links will be auto-deleted, Senders will receive warns

### Set Max Warns to 3
```
.maxwarns 3
```
Response: ✅ Maximum warns set to 3, Users will be kicked after 3 warns

### Check Your Warns
```
.warns
```
Shows: Current warn count, progress bar, recent warn reasons

### Check User's Warns
```
.warns @username
```

### Remove a Warn
```
.removewarn
```
(Reply to user's message)

### Clear All Warns
```
.clearwarns
```
(Reply to user's message)

### See Top Warned Users
```
.topwarns
```

## Configuration

### Default Settings
- **Antilink Status:** Disabled (must be enabled per group)
- **Max Warns:** 5 warns before kick
- **Admin Bypass:** Yes (admins can post links)
- **Auto-Delete:** Yes (when enabled)

### Change Max Warns
```
.maxwarns 3    # 3 warns before kick
.maxwarns 10   # 10 warns before kick
.maxwarns 1    # Instant kick on first link
```

## Important Notes

### Bot Permissions Required
- ✅ Delete messages (to remove links)
- ✅ Send messages (to notify of warns)
- ✅ Kick members (for auto-removal when max warns reached)
- ✅ Read group info

### Admin/Owner Bypass
- Group admins can post links without warns
- Bot admins can post links without warns
- Bot owner is never warned
- Bot itself is never warned

### Warn Persistence
- Warns are saved permanently
- Warns don't reset with bot restart
- Can be cleared manually with `.clearwarns`
- Each group has separate warn tracking

### Link Detection
- Links are detected even in media captions
- All URL formats detected automatically
- Social media invite links detected
- Case-insensitive detection

## Troubleshooting

### Links Not Being Deleted
- Ensure bot is admin in group
- Ensure antilink is enabled: `.antilink`
- Check bot has message deletion permissions

### Warns Not Tracking
- Ensure warns settings file exists (auto-created)
- Check file permissions on `data/` folder
- Verify JSON syntax in warnsSettings.json

### User Not Being Kicked
- Ensure bot is admin in group
- Check bot has kick permissions
- Verify max warns setting: `.maxwarns`

### False Positives
- Some legitimate text might contain "http://" pattern
- Consider using `.removewarn` to fix false warns
- Adjust max warns if too strict

## Integration with Other Features
- Works alongside welcome/goodbye system
- Compatible with public/private mode
- Integrates with group admin checking
- Uses same data storage pattern as other settings

## Security Features
- Only admins can manage warns
- Automatic kick prevents spam overflow
- Admin bypass prevents accidental locks
- Settings per-group isolation
- Persistent storage prevents data loss

---

**Created:** January 16, 2026
**Status:** ✅ Fully Implemented
**Features:** 6 commands + Auto-delete + Auto-kick
**Data Storage:** JSON file-based

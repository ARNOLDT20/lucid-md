# Welcome & Goodbye Message System 👋

## Overview
The welcome system automatically sends beautiful, styled messages when members join or leave your groups. It includes profile picture fetching, member counting, and customizable messages.

## Features
✅ **Auto Welcome Messages** - Greets new members with profile picture
✅ **Auto Goodbye Messages** - Says goodbye to leaving members
✅ **Member Counting** - Displays total group member count
✅ **Profile Picture Fetching** - Includes member's profile image
✅ **Beautiful Styling** - ASCII art borders and emoji decorations
✅ **Customizable Messages** - Set your own welcome/goodbye text
✅ **Per-Group Settings** - Different settings for each group
✅ **Admin Control** - Only admins can manage settings

## Commands

### `.welcome [on/off]`
**Enable or disable welcome messages in the group**
- `.welcome on` - Enable welcome messages
- `.welcome off` - Disable welcome messages
- `.welcome` - Check current status
- **Requirements:** Group admin only
- **Example:** `.welcome on`

### `.goodbye [on/off]`
**Enable or disable goodbye messages in the group**
- `.goodbye on` - Enable goodbye messages
- `.goodbye off` - Disable goodbye messages
- `.goodbye` - Check current status
- **Requirements:** Group admin only
- **Example:** `.goodbye on`

### `.setwelcome [message]`
**Set custom welcome message for your group**
- **Variables:**
  - `@user` - Member name
  - `@members` - Total members in group
  - `{user}` - Alternative syntax for member name
  - `{group}` - Group name
  - `{count}` - Total members (alternative)
  - `{desc}` - Group description

- **Requirements:** Group admin only
- **Example:** 
```
.setwelcome Welcome @user to our amazing group! 👋 Total members: @members
```

### `.setgoodbye [message]`
**Set custom goodbye message for your group**
- **Variables:**
  - `@user` - Member name
  - `@members` - Remaining members
  - `{user}` - Alternative syntax for member name

- **Requirements:** Group admin only
- **Example:**
```
.setgoodbye We'll miss you @user! Come back soon! 👋
```

### `.sendwelcome`
**Send welcome message to a specific member**
- Reply to a member's message or mention them
- Useful for welcoming someone manually
- **Requirements:** Group admin only
- **Example:** Reply to member's message: `.sendwelcome`

## Default Messages

### Welcome Message (Default)
```
╔════════════════════════════════╗
║      ✨ WELCOME TO THE GROUP ✨  ║
╚════════════════════════════════╝

👋 Hey @user!

Welcome to our amazing community! 🎉
We're thrilled to have you here.

📊 Total Members: @members
🌟 Get ready for an awesome experience!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rules: Read description before posting!
Have fun and be respectful! 😊
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Goodbye Message (Default)
```
╔════════════════════════════════╗
║        👋 GOODBYE MESSAGE 👋     ║
╚════════════════════════════════╝

We'll miss you @user! 😢

You were part of our journey with us.
Remaining members: @members

Hope to see you again soon! 💫

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Features Explained

### Profile Picture Integration
- Automatically fetches the joining/leaving member's WhatsApp profile picture
- Sends welcome/goodbye message WITH the image as caption
- Falls back to text-only if image can't be fetched
- Creates a more personal greeting experience

### Member Counting
- Automatically counts total members in the group
- Shows count in welcome message
- Updates dynamically when members join/leave
- Uses correct count (one less for goodbye messages)

### Beautiful Styling
- ASCII art borders for visual appeal
- Emoji decorations for better engagement
- Professional formatting with emojis
- Customizable with your own style

## Configuration

### Data Storage
- Settings stored in: `data/welcomeSettings.json`
- Each group has separate settings:
```json
{
  "groupId": {
    "welcome": true,
    "goodbye": true,
    "welcomeMsg": "Custom message...",
    "goodbyeMsg": "Goodbye message..."
  }
}
```

### Default Settings
- Welcome enabled: Based on `DEFAULT_WELCOME_ON_DEPLOY` in config
- Goodbye enabled: Based on `DEFAULT_GOODBYE_ON_DEPLOY` in config
- Messages: Beautiful styled defaults (can be customized per group)

## Usage Examples

### Setup Welcome with Default Message
```
.welcome on
```

### Setup Goodbye with Default Message
```
.goodbye on
```

### Create Custom Welcome
```
.setwelcome 🎉 WELCOME ABOARD 🎉
Hey @user, you just joined our community!
We now have @members members. Let's party! 🥳
```

### Create Custom Goodbye
```
.setgoodbye Thanks @user for being with us! Goodbye! 👋
Come back soon! We had @members members.
```

### Check Current Settings
```
.welcome
.goodbye
```

## Advanced Features

### Mention Integration
- Member who joins/leaves is automatically mentioned
- Clickable mention in the WhatsApp message
- Shows with @ symbol

### Group Context
- Messages include group name
- Can include group description
- Different settings per group

### Admin Only
- Only group admins can change settings
- Prevents non-admins from disabling messages
- Protects group settings

## Troubleshooting

### Profile Picture Not Showing
- The member's privacy settings might block picture fetching
- System falls back to text-only message automatically
- Try updating member's profile picture in WhatsApp

### Wrong Member Count
- Count is fetched at the moment of join/leave
- Accurate to the current group membership
- For goodbye, shows remaining members (total - 1)

### Custom Message Not Working
- Ensure you use `@user` or `{user}` for member name
- Ensure you use `@members` or `{count}` for member count
- Check for typos in the command

### Messages Not Sending
- Ensure bot has message sending permissions
- Check if welcome/goodbye is enabled: `.welcome` and `.goodbye`
- Verify bot is admin in the group (if using image captions)

## Technical Details

### Files Modified
- [index.js](index.js#L203) - Group participation event handler
- [plugins/welcomeManager.js](plugins/welcomeManager.js) - Main welcome plugin
- [lib/welcomeSettings.js](lib/welcomeSettings.js) - Settings management

### Event Handler
- Listens to `group-participants.update` event from Baileys
- Triggers on member join (add/invite)
- Triggers on member leave (remove/leave)
- Fetches profile pictures and member info
- Sends formatted message with replacements

### Performance
- Profile picture fetching is async (non-blocking)
- Falls back gracefully if fetch fails
- Efficient member count calculation
- No database overhead (file-based storage)

## Integration Points
- Works with existing Baileys WhatsApp MD bot
- Integrated with command system (command.js)
- Uses welcomeSettings for persistence
- Compatible with all other plugins

## Future Enhancements
- Add welcome images/templates
- Custom welcome sounds/voices
- Scheduled welcome messages
- Member role-based welcome messages
- Welcome statistics/tracking
- Multi-language support

---

**Created:** January 16, 2026
**Last Updated:** January 16, 2026
**Status:** ✅ Fully Implemented

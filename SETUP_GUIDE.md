# 🎯 LUCID MD Bot - Complete Feature Setup

## ✅ All Features Implemented & Working

### 🔤 **Auto-Typing & Recording**
Bot now shows typing/recording indicators while processing commands.

**Commands:**
- `.autotype` - Enable/disable typing indicator
- `.autorec` - Enable/disable recording indicator  
- `.typinginfo` - Show current settings

**How it works:**
When enabled, bot will show "typing..." or "recording..." while executing commands, making interactions feel more natural.

---

### 🔗 **AntiLink System** 
Automatically removes messages with links and warns users.

**Commands:**
- `.antilink on/off` - Enable/disable antilink
- `.maxwarns <number>` - Set warns before kick (1-20)
- `.warns` - Check your current warns
- `.removewarn` - Remove a warn from user
- `.clearwarns` - Clear all warns for user
- `.topwarns` - Show top warned users

**Features:**
- ✅ Detects: HTTP/HTTPS links, Discord invites, Telegram links
- ✅ Auto-deletes offending messages
- ✅ Progressive warn system with automatic kick
- ✅ Admins can share links without warnings
- ✅ Configurable max warns (default 5)

**Example Usage:**
```
.antilink on            → Enable in group
.maxwarns 3             → Set 3 warns = kick
(User shares link)      → Message deleted, warned
(After 3 links)         → User automatically removed
```

---

### 👋 **Welcome & Goodbye Messages**
Auto-greet new members and say goodbye to leaving members.

**Commands:**
- `.welcome on/off` - Enable/disable welcome messages
- `.goodbye on/off` - Enable/disable goodbye messages
- `.setwelcome <message>` - Set custom welcome message
- `.setgoodbye <message>` - Set custom goodbye message
- `.sendwelcome` - Manually send welcome to member

**Variables in Messages:**
- `@user` - Member's name
- `@members` - Total group members
- `{group}` - Group name
- `{desc}` - Group description

**Example Usage:**
```
.welcome on
.setwelcome Welcome @user to our group of @members people! 🎉
(New member joins) → Auto-sends customized welcome with their profile pic

.goodbye on  
.setgoodbye Goodbye @user! We had @members members. See you later! 👋
(Member leaves) → Auto-sends goodbye message
```

---

### 👁️ **View-Once Message Retriever**
Retrieve and forward hidden "view-once" messages.

**Command:**
- `.viewonce` - Reply to a view-once message to retrieve it

**Supports:**
- ✅ View-once images
- ✅ View-once videos
- ✅ View-once audio

**Example Usage:**
```
(Someone sends you a view-once photo/video)
Reply with: .viewonce
→ Bot retrieves and forwards the media to you
```

---

### 📊 **Status Auto Features**
Automatically interact with status updates.

**Commands:**
- `.autoview` - Toggle auto-viewing status updates
- `.autoreact` - Toggle auto-reacting to status
- `.statusinfo` - Check current settings

**Features:**
- Automatically marks status as seen
- Reacts with random emoji to status updates
- Works with all emoji customization

---

## 🚀 **Getting Started**

### 1. **Restart the Bot**
```bash
npm start
```

### 2. **Test Auto-Typing**
```
.autotype          → Enable typing indicator
.autorec           → Enable recording indicator
.typinginfo        → Verify settings
```

### 3. **Setup Group Features**
```
# In any group chat:
.welcome on
.goodbye on
.antilink on
.maxwarns 5
```

### 4. **Customize Messages**
```
.setwelcome Welcome to the party, @user! We now have @members members. 🎉
.setgoodbye Goodbye @user! We had an awesome time with you. See you later! 👋
```

### 5. **Test View-Once**
Send yourself a view-once image/video, then reply with `.viewonce` to retrieve it.

---

## 📁 **Files & Structure**

### Plugin Files
- `plugins/autoTyping.js` - Auto-typing & recording commands
- `plugins/antilink.js` - Link detection & warn system
- `plugins/welcomeManager.js` - Welcome/goodbye automation
- `plugins/viewonceRetriever.js` - View-once message retrieval
- `plugins/statusAuto.js` - Status auto-view/react

### Library Files
- `lib/globalSettings.js` - Global settings (typing, recording, react)
- `lib/warnsSettings.js` - User warns tracking
- `lib/welcomeSettings.js` - Welcome/goodbye settings
- `lib/statusSettings.js` - Status auto settings

### Data Storage
- `data/globalSettings.json` - Persistent global settings
- `data/warnsSettings.json` - Group warns data
- `data/welcomeSettings.json` - Welcome/goodbye templates per group
- `data/statusSettings.json` - Status settings

---

## 🎯 **Common Scenarios**

### Scenario 1: New Group Setup
```
.antilink on              → Prevent spam links
.maxwarns 3               → Quick enforcement
.welcome on               → Greet newcomers
.setwelcome Hello @user! Check pinned messages for rules!
.goodbye on               → Say goodbye
```

### Scenario 2: Activity Indicators
```
.autotype                 → Enable typing indicator
.autorec                  → Enable recording for voice-heavy groups
```

### Scenario 3: View-Once Privacy
```
(Receive view-once message)
.viewonce                 → Save it permanently
```

---

## ⚙️ **Settings Persistence**

All settings are automatically saved in the `/data` folder:
- They persist across bot restarts
- Per-group and per-user storage
- Automatic JSON file management

---

## 🔥 **Advanced Tips**

1. **Emoji Customization** - Edit the randomEmojis array in `data/globalSettings.json`
2. **Warn Persistence** - All warns are saved per group (check `warnsSettings.json`)
3. **Custom Templates** - Create message templates in `lib/welcome.js` and `lib/goodbye.js`
4. **Admin Bypass** - All antilink features skip admins automatically

---

## ✨ **Quick Command Reference**

| Feature | Commands |
|---------|----------|
| **Auto Typing** | `.autotype`, `.autorec`, `.typinginfo` |
| **AntiLink** | `.antilink`, `.maxwarns`, `.warns`, `.topwarns` |
| **Welcome** | `.welcome`, `.setwelcome`, `.sendwelcome` |
| **Goodbye** | `.goodbye`, `.setgoodbye` |
| **View-Once** | `.viewonce` |
| **Status** | `.autoview`, `.autoreact`, `.statusinfo` |

---

## 🐛 **Troubleshooting**

**View-Once not working?**
- Make sure you're replying to the exact view-once message
- Check that the message is actually view-once (not regular media)

**Antilink too strict?**
- Adjust `.maxwarns` to be more lenient
- Admins are automatically exempt

**Welcome messages not sending?**
- Enable with `.welcome on`
- Ensure bot is admin in the group
- Check if custom message has correct variables

**Auto-typing not showing?**
- Enable with `.autotype`
- Works when bot responds to commands
- Requires Baileys 6.7.0+

---

## 📞 **Support**

If you encounter any issues:
1. Check the console logs for error messages
2. Verify bot has necessary permissions (admin for group features)
3. Ensure all plugins loaded successfully on startup
4. Check `/data` folder for corrupted JSON files

---

**Bot Version:** 1.0.0  
**Baileys Version:** 6.7.0  
**Last Updated:** January 2026

Enjoy your fully-featured bot! 🎉

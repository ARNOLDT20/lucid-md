# ⚡ QUICK REFERENCE CARD - All Features at a Glance

## 🎯 5 Features + 18 Commands

### Feature 1: ⌨️ **Auto-Typing & Recording**
```
.autotype          Toggle typing indicator (shows "typing...")
.autorec           Toggle recording indicator (shows "recording...")
.typinginfo        Show current settings
```
**When:** Activates when bot responds to commands
**Storage:** `data/globalSettings.json`

---

### Feature 2: 🔗 **AntiLink System**  
```
.antilink on       Enable link detection and auto-delete
.antilink off      Disable antilink
.maxwarns 5        Set max 5 warns before auto-kick
.warns             Check your current warns
.removewarn        Admin removes a warn from user
.clearwarns        Admin clears all warns for user
.topwarns          Show top 10 warned users in group
```
**Detects:** HTTP links, Discord invites, Telegram links, www URLs
**Storage:** `data/warnsSettings.json`

---

### Feature 3: 👋 **Welcome & Goodbye**
```
.welcome on        Enable welcome messages for new members
.welcome off       Disable welcome messages
.goodbye on        Enable goodbye messages for leaving members
.goodbye off       Disable goodbye messages
.setwelcome Hello @user to our group! Members: @members
.setgoodbye Goodbye @user! See you later!
.sendwelcome       Manually send welcome to a member
```
**Variables:** `@user` (name), `@members` (count), `{group}`, `{desc}`
**Storage:** `data/welcomeSettings.json`

---

### Feature 4: 👁️ **View-Once Retriever**
```
(Reply to view-once message)
.viewonce          Retrieve and forward the hidden media
```
**Supports:** Images, Videos, Audio
**Storage:** None (on-the-fly retrieval)

---

### Feature 5: 📊 **Status Auto Features**
```
.autoview          Auto-mark status as seen
.autoreact         Auto-react to status with emoji
.statusinfo        Show status auto-settings
```
**Features:** Works while bot is running
**Storage:** `data/statusSettings.json`

---

## 🚀 Getting Started (60 Seconds)

### 1. Start Bot
```bash
npm start
```

### 2. Enable Features
```
(In any group chat)
.autotype          # Enable typing indicator
.antilink on       # Enable link protection
.welcome on        # Welcome new members
.goodbye on        # Say goodbye to leaving members
.autoview          # Auto-view status
```

### 3. Test
```
(Send any command → bot shows typing)
(Try sending a link → gets deleted with warning)
(New member joins → receives welcome message)
(Send view-once image → reply .viewonce to retrieve)
(Someone posts status → bot auto-views and reacts)
```

---

## 📊 Settings Location

| Feature | File | Location |
|---------|------|----------|
| Auto-Typing | globalSettings.json | `data/` |
| Auto-Recording | globalSettings.json | `data/` |
| AntiLink | warnsSettings.json | `data/` |
| Welcome/Goodbye | welcomeSettings.json | `data/` |
| Status Auto | statusSettings.json | `data/` |

All settings auto-save and persist across restarts.

---

## 🎪 Real-World Examples

### Example 1: Group Protection
```
.antilink on               # Prevent spam links
.maxwarns 3                # Quick enforcement
User: [sends link]
→ Message deleted, warned (1/3)
User: [sends another link]  
→ Message deleted, warned (2/3)
User: [sends third link]
→ Bot: "User removed for exceeding warns"
```

### Example 2: Member Experience
```
.welcome on
.setwelcome Hey @user! Welcome to our community. We have @members members. Check pinned messages for rules!
.goodbye on
.setgoodbye Goodbye @user! Thanks for being part of our journey. You were our @members-th member.

[New member joins] → Receives personalized welcome with profile pic
[Member leaves] → Group sees goodbye message
```

### Example 3: View-Once Privacy
```
Friend: [sends you a view-once image]
You: [replies with] .viewonce
→ Bot retrieves and forwards the image permanently
```

### Example 4: Natural Interaction
```
.autotype          # Bot shows typing indicator
.autorec           # Bot shows recording indicator
User: .ping
→ Bot shows "typing..." then "recording..." then responds
(Feels more natural than instant response)
```

---

## 🔥 Pro Tips

1. **Custom Welcome** - Use templates with variables
   ```
   .setwelcome 🎉 Welcome @user! Our group has @members awesome people!
   ```

2. **Flexible Warns** - Adjust enforcement
   ```
   .maxwarns 1    → Strict mode (1 strike)
   .maxwarns 10   → Lenient mode (10 strikes)
   ```

3. **Admin Bypass** - Admins automatically exempt from warns

4. **Emoji Reactions** - Edit emoji list in `data/globalSettings.json`

5. **Persistent Settings** - All settings auto-save on toggle

---

## ⚙️ Customization

### Change Welcome Message
```
.setwelcome 👋 Hey @user! Welcome to the best group. Total members: @members
```

### Change Goodbye Message  
```
.setgoodbye 😢 Goodbye @user! You were member #@members. Come back soon!
```

### Change Max Warns
```
.maxwarns 2      → Enforce quickly
.maxwarns 5      → Standard enforcement  
.maxwarns 10     → Lenient enforcement
```

---

## 📋 Quick Checklist

- [ ] Run `npm start`
- [ ] `.autotype` - Enable typing indicator
- [ ] `.antilink on` in group
- [ ] `.welcome on` in group
- [ ] `.goodbye on` in group
- [ ] `.autoview` - Enable status auto-view
- [ ] Test each feature with sample inputs

---

## 🆘 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| View-once not working | Make sure you reply to view-once message, not regular media |
| Antilink too strict | Use `.maxwarns 5` or higher |
| Welcome not sending | Ensure bot is group admin |
| Auto-typing not showing | Enable with `.autotype` |
| Settings not saving | Check folder permissions on `/data` |

---

## 📱 Command Count

**Total New Commands:** 18+
- Auto-Typing: 3 commands
- AntiLink: 6 commands  
- Welcome/Goodbye: 5 commands
- View-Once: 1 command
- Status Auto: 3 commands

---

## 🎉 Version Info

- **Baileys:** 6.7.0 (Latest)
- **Node.js:** 18.x required (using v24.11.1)
- **npm:** 11.6.2
- **Packages:** 603 total
- **Bot Version:** 1.0.0

---

## 📚 Full Documentation

For detailed information:
- 📖 **README_COMPLETE.md** - Complete overview
- 📖 **FEATURES.md** - Feature documentation
- 📖 **SETUP_GUIDE.md** - User setup guide
- 📖 **IMPLEMENTATION_CHECKLIST.md** - Technical details

---

## ✅ Status

**All Features:** ✅ IMPLEMENTED  
**All Commands:** ✅ WORKING  
**All Storage:** ✅ PERSISTENT  
**Documentation:** ✅ COMPLETE  

**You're all set! Enjoy your fully-featured bot! 🚀**

// Welcome Message Templates and Settings
module.exports = {
    // Default welcome message template
    DEFAULT_MSG: `╔════════════════════════════════╗
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
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

    // Alternative welcome templates
    TEMPLATES: {
        friendly: `🎉 Hey @user! Welcome to {group}! 
We're excited to have you here. Total members: @members
Enjoy your stay! 😊`,

        formal: `Welcome @user to {group}. 
You are member number @members in our community. 
Please read the group description and rules.`,

        minimal: `👋 Welcome @user to {group}!
Members: @members`,

        detailed: `╔════════════════════════════════╗
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
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

        party: `🥳🎊 WELCOME @user! 🎉🎈

Jump into the party! We now have @members awesome members!

Let's have some fun together! 🎪
🎭 Enjoy and be awesome! 🌟`,

        professional: `╔════════════════════════════════╗
║    WELCOME TO THE COMMUNITY    ║
╚════════════════════════════════╝

Hello @user,

Thank you for joining our group. We now have @members members.

Please take time to review:
📋 Group rules and guidelines
📌 Pinned messages for important info
🎯 Our community standards

We look forward to your participation!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    },

    // Get template by name
    getTemplate(name) {
        return this.TEMPLATES[name] || this.DEFAULT_MSG;
    },

    // Replace variables in welcome message
    replaceVariables(message, memberName, memberCount, groupName, groupDesc) {
        return message
            .replace(/@user/g, memberName)
            .replace(/{user}/g, memberName)
            .replace(/@members/g, String(memberCount))
            .replace(/{count}/g, String(memberCount))
            .replace(/{group}/g, groupName)
            .replace(/{desc}/g, groupDesc);
    },

    // Get all available templates
    listTemplates() {
        return Object.keys(this.TEMPLATES);
    }
};

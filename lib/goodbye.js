// Goodbye Message Templates and Settings
module.exports = {
    // Default goodbye message template
    DEFAULT_MSG: `╔════════════════════════════════╗
║        👋 GOODBYE MESSAGE 👋     ║
╚════════════════════════════════╝

We'll miss you @user! 😢

You were part of our journey with us.
Remaining members: @members

Hope to see you again soon! 💫

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

    // Alternative goodbye templates
    TEMPLATES: {
        friendly: `👋 Goodbye @user! We'll miss you!
Thanks for being with us. 
See you soon! @members members left.`,

        formal: `@user has left the group.
We now have @members members.
Thank you for your participation.`,

        minimal: `👋 Goodbye @user!
Members: @members`,

        detailed: `╔════════════════════════════════╗
║        👋 GOODBYE MESSAGE 👋     ║
╚════════════════════════════════╝

We'll miss you @user! 😢

You were part of our journey with us.
Remaining members: @members

Hope to see you again soon! 💫

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

        sad: `😢 Oh no! @user has left us!

We had @members amazing people together.
See you again soon, friend! 💔
Come back anytime!`,

        professional: `╔════════════════════════════════╗
║      MEMBER LEFT THE GROUP      ║
╚════════════════════════════════╝

@user has left our community.

We now have @members remaining members.

We appreciate your participation and hope to 
see you back soon. Safe travels! 👋

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,

        grateful: `🙏 Thank you @user for being part of our community!

You were one of our @members members.
We appreciate everything you contributed!

See you later! 👋`
    },

    // Get template by name
    getTemplate(name) {
        return this.TEMPLATES[name] || this.DEFAULT_MSG;
    },

    // Replace variables in goodbye message
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

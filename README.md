# lucid-md
✬ JUST ✬A ✬SIMPLE ✬WHATSAPP✬BOT

Deploy to Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ARNOLDT20/licid-md)

The deploy button uses the repository: https://github.com/ARNOLDT20/licid-md

Heroku session setup

When you click the Deploy button you'll be prompted for configuration values. Paste your base64-encoded WhatsApp session JSON into the `SESSION_BASE64` field. The deploy flow will store it as a config var and the app will decode and use it to connect automatically.

How to get `SESSION_BASE64` (example):

- If you already have `creds.json`, base64-encode it:

```bash
base64 creds.json > session.b64
cat session.b64
```

- Or encode in Node:

```bash
node -e "console.log(Buffer.from(require('./creds.json')).toString('base64'))"
```

Paste the resulting string into the `SESSION_BASE64` field during the Heroku deploy flow.

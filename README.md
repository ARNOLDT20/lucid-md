# LUCID MD

Deploy this WhatsApp bot to Heroku with one click:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ARNOLDT20/lucid-md)

Quick start

1. Click the Deploy button above.
2. In the Heroku deploy form set `SESSION_ID` (your session on mega) and any other `ALIVE_IMG` / `ALIVE_MSG` values.
3. Deploy and open the app; the bot will start automatically.

Notes

- The app listens on the `PORT` environment variable (Heroku provides this).
- The bot requires a valid `SESSION_ID` uploaded to Mega; the app downloads it at startup.
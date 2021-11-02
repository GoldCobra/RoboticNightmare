# Robotic Nightmare Bot for Mario Strikers

Link to discord

## Running the bot

1. Create `.env` file in this format

```
BOT_TOKEN=XXXX
CLIENT_ID=XXXX
DB_PASS=XXXX
DB_USER=XXXX
```

2. Ensure commands are [registered](#register-commands)

3. Run `npm run start`

## Slash Command Scripts

### Register Commands

Run `npm run commands:register`

This will register all commands under the `commands` folder and set Permissions for restricted commands.

### Delete Commands

Run `npm run commands:delete --command=<command-id>`

Running with no arguement will delete all commands.

### Get Commands

Run `npm run commands:get`

This will get all commands registered to the Bot.

### Get Permissions

Run `npm run permissions:get`

This will get all permissions for all commands registered to the Bot.

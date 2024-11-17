import dotenv from 'dotenv';
dotenv.config();

import { Client, IntentsBitField, Collection } from 'discord.js';
import sheetdbCommand from './commands/worldboss.js';

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

// Initialize the commands collection
client.commands = new Collection();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Register commands after the client is ready
    client.application.commands
        .create(sheetdbCommand.data)
        .then(() => {
            console.log('Command registered successfully!');
            // Set the command in the commands collection
            client.commands.set(sheetdbCommand.data.name, sheetdbCommand);
        })
        .catch(console.error);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    await command.execute(interaction);
});

client.login(process.env.DISCORD_TOKEN);

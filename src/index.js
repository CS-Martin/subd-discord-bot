import dotenv from 'dotenv';
dotenv.config();

import { Client, IntentsBitField, Collection } from 'discord.js';
import { worldboss_attendance_command } from './commands/7pm-worldboss.js';
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

    client.application.commands
        .create(worldboss_attendance_command.data)
        .then(() => {
            console.log('World Boss Attendance command registered successfully!');
            client.commands.set(worldboss_attendance_command.data.name, worldboss_attendance_command);
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

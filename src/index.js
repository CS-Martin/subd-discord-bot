import dotenv from 'dotenv';
dotenv.config();

import { Client, IntentsBitField, Collection } from 'discord.js';
import { attendance_7pm_command } from './commands/7pm-worldboss.js';
import { attendance_9pm_command } from './commands/9pm-worldboss.js';
import { attendance_12am_command } from './commands/12am-worldboss.js';
import { attendance_archboss_command } from './commands/archboss.js';
import { attendance_tax_command } from './commands/tax.js';
import { attendance_siege_command } from './commands/siege.js';
import { attendance_boonstone_riftstone_command } from './commands/boonstone.riftstone.js';

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

    const commands = [
        attendance_7pm_command,
        attendance_9pm_command,
        attendance_12am_command,
        attendance_archboss_command,
        attendance_tax_command,
        attendance_siege_command,
        attendance_boonstone_riftstone_command,
    ];

    for (const command of commands) {
        client.application.commands.create(command.data)
            .then(() => {
                console.log(`Command ${command.data.name} is ready!`);
            })
            .catch((error) => {
                console.error(`Error creating command ${command.data.name}:`, error);
            });
        client.commands.set(command.data.name, command);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    await command.execute(interaction);
});

client.login(process.env.DISCORD_TOKEN);

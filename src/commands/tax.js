import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import GoogleSpreadsheetService from '../services/google.spreadsheet.service.js';

const googleSheetService = new GoogleSpreadsheetService();

export const attendance_tax_command = {
    data: (() => {
        const builder = new SlashCommandBuilder()
            .setName('tax-attendance')
            .setDescription('Use this command to record your attendance for attending Tax.');

        for (let i = 1; i <= 6; i++) {
            builder.addUserOption((option) =>
                option
                    .setName(`user${i}`)
                    .setDescription(`User ${i} to increment points for`)
                    .setRequired(i === 1)
            );
        }

        builder.addAttachmentOption((option) =>
            option
                .setName('screenshot')
                .setDescription('Attach a screenshot for attendance verification (optional)')
                .setRequired(false)
        );
        return builder;
    })(),

    async execute(interaction) {
        console.log('Starting Siege Attendance Command...');
        await interaction.deferReply();

        try {
            const excel_data = await googleSheetService.readSheet(process.env.SPREADSHEET_ID, 'Daily Tally!A1:I100');
            console.log('Spreadsheet data:', excel_data);

            const users = new Set();
            const screenshot = interaction.options.getAttachment('screenshot');

            for (let i = 1; i <= 6; i++) {
                const user = interaction.options.getMember(`user${i}`);
                if (!user) break;

                // Check for bot users
                if (user.user.bot) {
                    await interaction.followUp(`❌ Sorry, I can't record attendance for bots.`);
                    return;
                }

                // Check for duplicate entries
                if (users.has(user.id)) {
                    await interaction.followUp(
                        `❌ You cannot provide the same user multiple times (${user.nickname || user.user.username || user.user.globalName}). This is considered cheating!`
                    );
                    return;
                }

                users.add(user.id);

                const foundUserIndex = excel_data.findIndex((row) => row[0] === user.nickname);
                if (foundUserIndex === -1) {
                    await interaction.followUp(`❌ Could not find ${user.nickname || user.user.username || user.user.globalName} in the spreadsheet.`);
                    return;
                }

                const current_points = parseInt(excel_data[foundUserIndex][8], 10) || 0;
                excel_data[foundUserIndex][8] = current_points + 3;
            }

            console.log('Updated Spreadsheet Data:', excel_data);

            await googleSheetService.updateSheet(
                process.env.SPREADSHEET_ID,
                `Daily Tally!A1:I${excel_data.length}`,
                excel_data
            );

            const embed = new EmbedBuilder()
                .setTitle('Successfully Recorded Tax Attendance!')
                .setDescription(`Recorded users:\n ${Array.from({ length: 6 }, (_, i) => {
                    const user = interaction.options.getMember(`user${i + 1}`);
                    return user ? `${user.displayName}\n` : '';
                }).join('')}\n**Thank you for participating! Keep up the good work!** 🎉`)
                .setColor(0x00ff00);

            if (screenshot) {
                embed.setImage(screenshot.url);
            }

            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error('Error in Tax Attendance Command:', error);
            await interaction.followUp(`❌ An error occurred while recording attendance: ${error.message}`);
        }
    },
};
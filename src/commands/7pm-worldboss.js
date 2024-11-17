import { SlashCommandBuilder } from 'discord.js';
import SheetDBService from '../services/sheetdb.service.js';

const sheetDbService = new SheetDBService();

export const worldboss_attendance_command = {
    data: new SlashCommandBuilder()
        .setName('7pm-worldboss-attendance')
        .setDescription('Use this command to record your attendance for attending World Bosses.')
        .addUserOption((option) =>
            option.setName('user1').setDescription('User to increment points for').setRequired(true),
        )
        .addUserOption((option) =>
            option.setName('user2').setDescription('User to increment points for').setRequired(false),
        )
        .addUserOption((option) =>
            option.setName('user3').setDescription('User to increment points for').setRequired(false),
        )
        .addUserOption((option) =>
            option.setName('user4').setDescription('User to increment points for').setRequired(false),
        )
        .addUserOption((option) =>
            option.setName('user5').setDescription('User to increment points for').setRequired(false),
        )
        .addUserOption((option) =>
            option.setName('user6').setDescription('User to increment points for').setRequired(false),
        ),

    async execute(interaction) {
        console.log('Starting 7PM World Boss Attendance Command...');

        await interaction.deferReply();

        // @Description: Fetch users and points from the API
        // !NOTE: Take note that everything you fetch from the API is in form of string
        const excel_data = await sheetDbService.fetchAllUsers();

        const users = [];
        for (let i = 1; i <= 6; i++) {
            const user = interaction.options.getMember(`user${i}`);

            if (!user) {

                await interaction.followUp(`Please provide a user for user${i}`);

                break;

            }

            // Check if the user exists in the excel data
            const foundUser = excel_data.find((item) => item.IGN === user.nickname);

            console.log("FOUND USER", foundUser);

            if (foundUser) {

                const user_prev_points = parseInt(foundUser['7:00 PM'], 10) || 0;

                console.log("USER PREV POINTS", user_prev_points);

                users.push({
                    ign: user.nickname,
                    points: user_prev_points + 1,
                });

            } else {

                console.log(`User ${user.user.globalName} does not exist in the excel data`);

                await interaction.followUp(`Sorry, I could not find ${user.user.globalName} in the excel data`);

                return;

            }
        }


        for (const user of users) {
            await sheetDbService.update7pmWorldBossPoints(user.ign, user.points);
        }

        await interaction.followUp('🎉 Successfully recorded your attendance! Keep up the good work! 🎉');
    },

    
};


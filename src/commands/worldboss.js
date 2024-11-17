import SheetDBService from '../services/sheetdb.service.js';
import { GuildMember, SlashCommandBuilder } from 'discord.js';

const sheetDbService = new SheetDBService();

const sheetdbCommand = {
    data: new SlashCommandBuilder()
        .setName('worldboss-attendance')
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
        console.log('Starting World Boss Attendance Command...');

        await interaction.deferReply();

        // @Description: Fetch users and points from the API
        // !NOTE: Take note that everything you fetch from the API is in form of string
        const excel_data = await sheetDbService.fetchAllUsers();

        const users = [];
        for (let i = 1; i <= 6; i++) {
            const user = interaction.options.getMember(`user${i}`);

            if (!user) {
                break;
            }

            // Check if the user exists in the excel data
            const foundUser = excel_data.find((item) => item.Name === user.nickname);

            if (foundUser) {

                const user_prev_points = parseInt(foundUser.Points, 10);

                users.push({
                    nickname: user.nickname,
                    points: user_prev_points + 1,
                });

            } else {

                console.log(`User ${user.user.globalName || user.user.username} does not exist in the excel data`);

                await interaction.followUp(`Sorry, I could not find ${user.user.globalName || user.user.username} in the excel data`);

                return;

            }
        }


        for (const user of users) {
            await sheetDbService.updateUserPoints(user.nickname, user.points);
        }

        await interaction.followUp('🎉 Successfully recorded your attendance! Keep up the good work! 🎉');
    },
};

// Export the command as default
export default sheetdbCommand;

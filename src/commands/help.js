const fs = require('fs');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all available commands'),
    async execute(interaction) {
        const commandFiles = fs
            .readdirSync('./commands')
            .filter((file) => file.endsWith('.js'));

        const embed = new EmbedBuilder();

        for (const file of commandFiles) {
            const command = require(`./${file}`);
            embed.addFields({
                name: `${command.data.name}`,
                value: `${command.data.description}`,
            });
        }

        return interaction.reply({
            embeds: [embed],
        });
    },
};

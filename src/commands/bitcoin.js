const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const QuickChart = require('quickchart-js');
const wait = require('node:timers/promises').setTimeout;

const createChartUrl = async (url) => {
    const json = await fetch(url).then((response) => response.json());

    const chart = new QuickChart();

    // Format the data for the chart
    const data = {
        labels: [],
        datasets: [
            {
                label: 'Price',
                data: [],
            },
        ],
    };

    // Loop over the data points in the JSON
    for (const point of json.data.slice(-15)) {
        // Add the date for the data point to the labels array
        data.labels.push(new Date(point.date).toLocaleString());

        data.datasets[0].data.push(point.priceUsd);
    }

    // Set the chart type and data
    chart.setConfig({
        type: 'line',
        data: data,
    });

    // Set the chart width and height
    chart.setWidth(800);
    chart.setHeight(400);

    // Get the chart image URL
    const chartUrl = await chart.getShortUrl();
    return chartUrl;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bitcoin')
        .setDescription('Displays price of Bitcoin.'),

    async execute(interaction) {
        await interaction.deferReply();
        const url = await createChartUrl(
            'https://api.coincap.io/v2/assets/bitcoin/history?interval=d1'
        );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('5m')
                .setLabel('5m')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('30m')
                .setLabel('30m')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('1h')
                .setLabel('1h')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('1d')
                .setLabel('1d')
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.editReply({ content: url, components: [row] });

        const collector = interaction.channel.createMessageComponentCollector({
            time: 15000,
        });

        collector.on('collect', async (i) => {
            let chartUrl;
            if (i.customId === '5m') {
                chartUrl = await createChartUrl(
                    'https://api.coincap.io/v2/assets/bitcoin/history?interval=m5'
                );
                await i.update({ content: chartUrl, components: [row] });
            } else if (i.customId === '30m') {
                chartUrl = await createChartUrl(
                    'https://api.coincap.io/v2/assets/bitcoin/history?interval=m30'
                );
                await i.update({ content: chartUrl, components: [row] });
            } else if (i.customId === '1h') {
                chartUrl = await createChartUrl(
                    'https://api.coincap.io/v2/assets/bitcoin/history?interval=h1'
                );
                await i.update({ content: chartUrl, components: [row] });
            } else if (i.customId === '1d') {
                chartUrl = await createChartUrl(
                    'https://api.coincap.io/v2/assets/bitcoin/history?interval=d1'
                );
                await i.update({ content: chartUrl, components: [row] });
            }
        });

        collector.on('end', () => {
            interaction.channel.send(
                'Sorry, the time has run out for this interaction. Please try again if you would like to use this feature.'
            );
        });
    },
};

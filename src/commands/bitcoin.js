const { SlashCommandBuilder } = require("discord.js");
const QuickChart = require('quickchart-js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('bitcoin')
    .setDescription('Displays price of Bitcoin.'),

    async execute(interaction) {
        await interaction.deferReply()
        const json = await fetch('https://api.coincap.io/v2/assets/bitcoin/history?interval=d1')
        .then((response) => response.json())

        const chart = new QuickChart();

        // Format the data for the chart
        const data = {
          labels: [],
          datasets: [
            {
              label: "Price",
              data: []
            }
          ]
        };
        
        // Loop over the data points in the JSON
        for (const point of json.data.slice(-15)) {
          // Add the date for the data point to the labels array
          data.labels.push(new Date(point.date).toLocaleString());
        
          // Add the price for the data point to the data array
          data.datasets[0].data.push(point.priceUsd);
        }
        
        // Set the chart type and data
        chart.setConfig({
          type: 'line',
          data: data
        });
        
        // Set the chart width and height
        chart.setWidth(800);
        chart.setHeight(400);
        
        // Get the chart image URL
        const chartUrl = await chart.getShortUrl();
        
        // Print the chart URL
        console.log(chartUrl);

         await interaction.editReply(chartUrl)

    }
}
const { Events, ActivityType } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
        setInterval(async () => {
             const bitcoinData = await fetch('https://api.coincap.io/v2/assets/bitcoin')
            .then((response) => response.json())
            client.user.setActivity('BTC ' + formatter.format(bitcoinData.data.priceUsd), {type: ActivityType.Watching});
        }, 4000);
	},
};
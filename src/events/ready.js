const { Events } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
        setInterval(async () => {
             const bitcoinData = await fetch('https://api.coincap.io/v2/assets/bitcoin')
            .then((response) => response.json())
            client.user.setActivity(bitcoinData.data.priceUsd);
        }, 20000);
	},
};
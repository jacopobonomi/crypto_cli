import chalk from 'chalk';

import chalkAnimation from 'chalk-animation';
import terminalLink from 'terminal-link';
import axios from "axios";

const currency = process.argv[2];
const X_RAPID_API_KEY = process.env.X_RAPID_API_KEY;

if (!X_RAPID_API_KEY) {
    console.log("Please set the X_RAPID_API_KEYs environment variable")
    process.exit(1)
}

const options = {
    method: 'GET',
    url: 'https://coingecko.p.rapidapi.com/coins/markets',
    params: { vs_currency: currency ? currency : 'usd', page: '1', per_page: '5', order: 'market_cap_desc' },
    headers: {
        'X-RapidAPI-Key': `${X_RAPID_API_KEY}`,
        'X-RapidAPI-Host': 'coingecko.p.rapidapi.com'
    }
};
chalkAnimation.rainbow('Loading prices...');
axios.request(options).then(function (response) {
    const { data } = response;
    data.map(({ name, symbol, current_price, market_cap, price_change_percentage_24h }) => {
        const priceWithCurrency = current_price.toFixed(2) + ' ' + (currency ? currency : 'USD');
        const link = terminalLink('CoinGeko', `https://www.coingecko.com/en/coins/${name.toLowerCase().replace(" ", "-")}`);
        console.log("-----------------------------------------------------");
        console.log(`${name} (${symbol})`);
        console.log(`Current Price: ${price_change_percentage_24h > 0 ? chalk.bgGreen.bold(priceWithCurrency) : chalk.bgRed.bold(priceWithCurrency)} `);
        console.log(`Market Cap: ${chalk.bold(market_cap)}`);
        console.log(`Change 24h: ${chalk.bold(price_change_percentage_24h)}%`);
        console.log(link);
    })
    console.log("-----------------------------------------------------");
    console.log("\n")
    console.log("Thank you for usage, support on:")
    console.log(chalk.bold(terminalLink('Github', `https://www.coingecko.com/en/coins/`)));

}).catch(function (error) {
    console.error(error);
});
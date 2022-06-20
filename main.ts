require('dotenv').config();
import { Telegraf } from 'telegraf';
import { RealCurrencyExchangeRate } from './src/RealCurrencyExchangeRate';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  let message = `Используйте команду /rate и укажите пару валют для которых вы хотите узнать реальный курс, например /rate RUBEUR`;
  ctx.reply(message)
});

bot.command('rate', async (ctx) => {
  try {
    const { text } = ctx.update.message;
    const currenciesSymbols = text.replace('/rate ', '');
    const exchange = new RealCurrencyExchangeRate(currenciesSymbols);
    const result = await exchange.get();

    ctx.replyWithHTML(`
По данным на ${result.time} MSK стоимость ${result.currency}:\n
<strong>${result.rate} ${result.symbol}</strong>\n
Доступные методы обмена: ${result.methods}\n
Источник: <a href="https://p2p.binance.com/en/trade/all-payments/USDT?fiat=${result.fiat}">Binance</a>
    `, { disable_web_page_preview: true })
  } catch (error) {
    ctx.reply('Укажите пару валют, например RUBEUR')
  }
});

bot.launch();

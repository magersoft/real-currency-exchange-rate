import { Telegraf } from 'telegraf';
import { RealCurrencyExchangeRate } from './RealCurrencyExchangeRate';

const BOT_TOKEN = process.env.BOT_TOKEN || '';

export default function TelegramBot() {
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

      console.log(result);

      ctx.replyWithHTML(`
По данным на ${result.time} MSK стоимость ${result.currency}:\n
<strong>${result.rate} ${result.symbol}</strong>\n
Доступные суммы обмена: <strong>${result.minValue} - ${result.maxValue}</strong>\n
Доступные методы обмена: ${result.methods}\n
Источник: <a href="https://p2p.binance.com/en/trade/all-payments/USDT?fiat=${result.fiat}">Binance</a>
    `, { disable_web_page_preview: true })
    } catch (error) {
      console.log(error);
      ctx.reply(error.message);
    }
  });

  bot.launch();
}

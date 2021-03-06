import * as https from 'https';
import {
  IRealCurrencyExchangeRate,
  TFetchP2P,
  TP2POrderDetail,
  TP2PResponse,
  TRateCurrencySymbol,
  TRateResult
} from './Domain';
import { ClientRequestArgs } from 'http';
import getPayTypes from './payTypes';

export class RealCurrencyExchangeRate implements IRealCurrencyExchangeRate {
  static P2P_PAGE = 1;
  static P2P_ROWS = 20;
  static P2P_ASSET = 'USDT';
  static P2P_DEFAULT_PAY_TYPES = ['BANK'];

  private firstP2PData: TP2POrderDetail[] = [];
  private secondP2PData: TP2POrderDetail[] = [];

  public currency: string = '';
  public symbol: string = '';
  public fiat: string = '';
  public rate: number = 0;
  public minValue: string = '';
  public maxValue: string = '';
  public time: string = '';
  public availableTradeMethods: string = '';

  constructor(public readonly currenciesSymbols: string) {
    this.currenciesSymbols = currenciesSymbols;
  }

  public async get(): Promise<TRateResult> {
    await this.calculate();

    this.roundCurrency();
    this.getTradeMethods();
    this.getCurrencySymbol();
    this.getCurrencyUnit();
    this.getCurrentTime();
    this.getValuePrices();

    return {
      currency: this.currency,
      rate: this.rate,
      symbol: this.symbol,
      minValue: this.minValue,
      maxValue: this.maxValue,
      fiat: this.fiat,
      time: this.time,
      methods: this.availableTradeMethods,
    }
  }

  public async fetchP2PData(data: TFetchP2P): Promise<TP2PResponse> {
    return new Promise((resolve, reject) => {
      const payTypes = getPayTypes();
      const stringData = JSON.stringify({
        page: RealCurrencyExchangeRate.P2P_PAGE,
        rows: RealCurrencyExchangeRate.P2P_ROWS,
        merchantCheck: data.fiat === 'USD',
        publisherType: data.fiat === 'USD' ? 'merchant' : null,
        payTypes: payTypes[data.fiat] || RealCurrencyExchangeRate.P2P_DEFAULT_PAY_TYPES,
        ...data,
      });

      const options: ClientRequestArgs = {
        hostname: 'p2p.binance.com',
        port: 443,
        path: '/bapi/c2c/v2/friendly/c2c/adv/search',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': stringData.length,
        },
      }

      const request = https.request(options, (response) => {
        let output = '';
        response.on('data', (data: any) => {
          output += data;
        });

        response.on('end', () => {
          try {
            const jsonOutput = JSON.parse(output);
            resolve(jsonOutput);
          } catch (error) {
            reject(error);
          }
        });
      });

      request.on('error', (error: Error) => {
        reject(error);
      });

      request.write(stringData);
      request.end();
    })
  }

  private async calculate(): Promise<void> {
    const { firstCurrencySymbol, secondCurrencySymbol } = this.parseCurrenciesSymbols();

    const { data: firstP2PData } = await this.fetchP2PData({
      fiat: firstCurrencySymbol,
      tradeType: 'BUY',
      asset: RealCurrencyExchangeRate.P2P_ASSET,
    });

    const { data: secondP2PData } = await this.fetchP2PData({
      fiat: secondCurrencySymbol,
      tradeType: 'SELL',
      asset: RealCurrencyExchangeRate.P2P_ASSET,
    });

    if (!firstP2PData.length || !secondP2PData.length) {
      throw new Error('???????????? ?????????????? ?????????????????????? ?????? ???? ??????????????');
    }

    this.firstP2PData = firstP2PData;
    this.secondP2PData = secondP2PData;

    const firstCurrency = RealCurrencyExchangeRate.getMiddleCurrencyPrice(this.firstP2PData);
    const secondCurrency = RealCurrencyExchangeRate.getMiddleCurrencyPrice(this.secondP2PData);

    this.rate = firstCurrency / secondCurrency;
  }

  private parseCurrenciesSymbols(): TRateCurrencySymbol {
    if (this.currenciesSymbols.length !== 6) {
      throw new Error('?????????????? ???????? ??????????, ???????????????? RUBEUR');
    }

    const firstCurrencySymbol = this.currenciesSymbols.slice(0, 3).toUpperCase();
    const secondCurrencySymbol = this.currenciesSymbols.slice(3).toUpperCase();

    return { firstCurrencySymbol, secondCurrencySymbol };
  }

  private getTradeMethods(): void {
    const methods = [];

    for (const item of this.secondP2PData) {
      const tradeMethodNames = item.adv.tradeMethods.map(item => item.tradeMethodName);
      for (const name of tradeMethodNames) {
        methods.push(name);
      }
    }

    const availableMethods = [...new Set(methods)];
    this.availableTradeMethods = availableMethods.join(', ');
  }

  private roundCurrency(): void {
    this.rate = +this.rate.toFixed(4);
  }

  private getCurrencySymbol(): void {
    this.symbol = this.firstP2PData[0].adv.fiatSymbol;
  }

  private getCurrencyUnit(): void {
    const code = this.secondP2PData[0].adv.fiatUnit;

    this.fiat = this.firstP2PData[0].adv.fiatUnit;
    this.currency = new Intl.NumberFormat('ru', { style: 'currency', currency: code, currencyDisplay: 'name' }).format(1);
  }

  private getCurrentTime(): void {
    this.time = new Date().toLocaleTimeString('ru-RU', {timeZone: "Europe/Moscow"})
  }

  private getValuePrices(): void {
    const code = this.secondP2PData[0].adv.fiatUnit;
    const minTransAmounts = [];
    const maxTransAmounts = [];

    for (const item of this.secondP2PData) {
      minTransAmounts.push(+item.adv.minSingleTransAmount);
      maxTransAmounts.push(+item.adv.maxSingleTransAmount);
    }

    this.minValue = new Intl.NumberFormat('ru', {
      style: 'currency',
      currency: code,
    }).format(Math.min.apply(null, minTransAmounts));

    this.maxValue = new Intl.NumberFormat('ru', {
      style: 'currency',
      currency: code,
    }).format(Math.max.apply(null, maxTransAmounts));
  }

  private static getMiddleCurrencyPrice(data: TP2POrderDetail[]): number {
    const prices = data.map((item) => +item.adv.price);
    return prices.reduce((a: number, b: number) => (a + b) / prices.length);
  }
}

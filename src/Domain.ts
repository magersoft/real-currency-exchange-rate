export type TTradeType = 'BUY' | 'SELL';
export type TAsset = 'USDT';

export type TRateCurrencySymbol = {
  firstCurrencySymbol: string;
  secondCurrencySymbol: string;
}

export type TRateResult = {
  currency: string;
  rate: number;
  symbol: string;
  fiat: string;
  time: string;
  methods: string;
}

export type TFetchP2P = {
  fiat: string;
  tradeType: TTradeType;
  asset: string;
  payTypes?: any;
};

export type TP2PResponse = {
  code: string;
  message: any;
  messageDetail: any;
  data: TP2POrderDetail[];
  total: number;
  success: boolean;
};

export type TP2POrderDetail = {
  adv: {
    advNo: string,
    classify: string,
    tradeType: TTradeType,
    asset: TAsset,
    fiatUnit: string,
    price: string,
    initAmount: string,
    surplusAmount: string,
    amountAfterEditing: string,
    maxSingleTransAmount: string,
    minSingleTransAmount: string,
    autoReplyMsg: string,
    payTimeLimit: number,
    assetScale: number,
    fiatScale: number,
    priceScale: number,
    fiatSymbol: string,
    isTradable: true,
    dynamicMaxSingleTransAmount: string,
    minSingleTransQuantity: string,
    maxSingleTransQuantity: string,
    dynamicMaxSingleTransQuantity: string,
    tradableQuantity: string,
    commissionRate: string,
    tradeMethodCommissionRates: any[],
    launchCountry: any,
    tradeMethods: any[]
  };
  advertiser: any;
}

export interface IRealCurrencyExchangeRate {
  get(): Promise<TRateResult>;
  fetchP2PData(data: TFetchP2P): Promise<TP2PResponse>;
}

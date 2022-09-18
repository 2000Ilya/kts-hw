export type GetCoinsListParams = {
  queryParameters: {};
};

export type GetCoinParams = {
  coinName: string | undefined;
  queryParameters: {};
};

export type ApiResp<dataT> = {
  data: dataT;
  success: boolean;
};

export type CoinItem = {
  symbol: string;
  name: string;
  image: string;
  current_price: string;
  id: string;
  price_change_percentage_24h: number;
};

export type Coin = {
  market_data: {
    current_price: { usd: number };
    price_change_24h: number;
    price_change_percentage_24h: number;
  };
  image: { large: string };
  name: string;
  symbol: string;
  id: string;
};

export interface ICoinGeckoStore {
  getCoinsList(params: GetCoinsListParams): Promise<ApiResp<CoinItem[]>>;

  getCoin(params: GetCoinParams): Promise<ApiResp<Coin>>;
}

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

export type CoinModel = {
  marketData: {
    currentPrice: { usd: number };
    priceChange24h: number;
    priceChangePercentage24h: number;
  };
  image: { large: string };
  name: string;
  symbol: string;
  id: string;
};

export const normalizeCoin = (from: Coin): CoinModel => ({
  marketData: {
    currentPrice: { usd: from.market_data.current_price.usd },
    priceChange24h: from.market_data.price_change_24h,
    priceChangePercentage24h: from.market_data.price_change_percentage_24h,
  },
  image: { large: from.image.large },
  name: from.name,
  symbol: from.symbol,
  id: from.id,
});

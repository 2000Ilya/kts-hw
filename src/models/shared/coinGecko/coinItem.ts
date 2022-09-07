export type CoinItem = {
  symbol: string;
  name: string;
  image: string;
  current_price: string;
  id: string;
  price_change_percentage_24h: number;
};

export type CoinItemModel = {
  symbol: string;
  name: string;
  image: string;
  currentPrice: string;
  id: string;
  priceChangePercentage24h: number;
};

export const normalizeCoinItem = (from: CoinItem): CoinItemModel => ({
  symbol: from.symbol,
  name: from.name,
  image: from.image,
  currentPrice: from.current_price,
  id: from.id,
  priceChangePercentage24h: from.price_change_percentage_24h,
});

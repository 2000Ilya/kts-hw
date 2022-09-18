export type CoinItem = {
  symbol: string;
  name: string;
  image: string;
  current_price: string;
  id: string;
  price_change_percentage_24h: number;
};

export type CoinItemSearched = {
  id: string;
  name: string;
  symbol: string;
  large: string;
};

export type CoinItemModel = {
  symbol: string;
  name: string;
  image: string;
  currentPrice: string | null;
  id: string;
  priceChangePercentage24h: number | null;
};

export const normalizeCoinItem = (from: CoinItem): CoinItemModel => ({
  symbol: from.symbol,
  name: from.name,
  image: from.image,
  currentPrice: from.current_price,
  id: from.id,
  priceChangePercentage24h: from.price_change_percentage_24h,
});

export const normalizeCoinItemSearched = (
  from: CoinItemSearched
): CoinItemModel => ({
  symbol: from.symbol,
  name: from.name,
  image: from.large,
  currentPrice: null,
  id: from.id,
  priceChangePercentage24h: null,
});

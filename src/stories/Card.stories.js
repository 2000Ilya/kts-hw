import Card from "../components/Card";

export default {
  title: "Card",
  component: Card,
};

export const Bitcoin = () => (
  <Card
    image={"https://s3-symbol-logo.tradingview.com/crypto/XTVCBTC--big.svg"}
    title={"Bitcoin"}
    subtitle={"BTC"}
    currentPrice={"₹2,509.75"}
    priceChangePercentage={"+9.77%"}
  />
);

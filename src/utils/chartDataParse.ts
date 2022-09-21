import { ChartData, ChartDataParsed } from "@store/CoinGeckoStore/types";
import roundNumber from "@utils/roundNumber";

export default (prices: ChartData): ChartDataParsed[] | null =>
  prices
    .map((e, index) => {
      if (index % 7 === 0) {
        const time = new Date(e[0]).toTimeString().slice(0, 5);
        const price = e[1];
        return { name: time, price: roundNumber(price) };
      }
    })
    .filter((e) => e !== undefined);

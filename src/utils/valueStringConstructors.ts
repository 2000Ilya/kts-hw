import roundNumber from "@utils/roundNumber";

const addSignToStartOfString = (value: number, str: string) => {
  if (value >= 0) {
    return "+" + str;
  } else {
    return "-" + str;
  }
};

export const priceStringConstructor = (
  currencySign: string,
  price: string
): string => `${currencySign}${roundNumber(price)}`;

export const percentageStringConstructor = (percentage: number): string =>
  addSignToStartOfString(percentage, `${roundNumber(Math.abs(percentage))}%`);

export const coinInfoValueStringConstructor = (
  price: number,
  percentage: number
): string =>
  addSignToStartOfString(
    percentage,
    `${roundNumber(Math.abs(price))} (${roundNumber(Math.abs(percentage))}%)`
  );

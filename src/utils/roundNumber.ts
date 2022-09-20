export default (value: string | number): number => {
  let formattedValue: number;
  if (typeof value === "string") {
    formattedValue = Number(value);
  } else {
    formattedValue = value;
  }
  return Math.round((formattedValue + Number.EPSILON) * 100) / 100;
};

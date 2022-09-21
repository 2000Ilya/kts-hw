const currencySigns: { [key: string]: string } = {
  btc: "₿",
  eth: "Ξ",
  ltc: "Ł",
  xrp: "XRP",
  usd: "$",
  aed: "AED",
  aud: "A$",
  bdt: "৳",
  bhd: ".د.ب",
  brl: "R$",
  cad: "CA$",
  chf: "CHF",
  cny: "元",
  czk: "Kč",
  dkk: "kr",
  eur: "€",
  gbp: "£",
  hkd: "HK$",
  huf: "ft",
  idr: "Rp",
  ils: "₪",
  inr: "₹",
  rub: "₽",
  jpy: "¥",
};

export default (currency: string): string => {
  if (currencySigns.hasOwnProperty(currency)) {
    return currencySigns[currency];
  }
  return "";
};

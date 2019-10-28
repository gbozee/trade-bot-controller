export const configs = [
  {
    id: 1,
    coin: "BTC",
    buy_market: "USDT",
    spread: 7,
    multiplier: 2,
    buy_amount: 10.1,
    price_places: ".2f",
    pause: true
  },
  {
    id: 2,
    coin: "ETH",
    buy_market: "USDT",
    spread: 4,
    multiplier: 3,
    buy_amount: 10.1,
    price_places: ".2f"
  },
  {
    id: 3,
    coin: "XRP",
    buy_market: "USDT",
    spread: 7,
    multiplier: 2,
    buy_amount: 10.1,
    price_places: ".2f"
  },
  {
    id: 4,
    coin: "XMR",
    buy_market: "USDT",
    spread: 12,
    multiplier: 2,
    buy_amount: 10.1,
    price_places: ".2f"
  },
  {
    id: 5,
    coin: "ONT",
    buy_market: "USDT",
    spread: 9,
    multiplier: 2,
    buy_amount: 10.1,
    price_places: ".2f"
  },
  {
    id: 6,
    coin: "ETH",
    buy_market: "BTC",
    spread: 15,
    multiplier: 2,
    buy_amount: 0.0014,
    price_places: ".5f"
  },
  {
    id: 7,
    coin: "BNB",
    buy_market: "USDT",
    spread: 10,
    multiplier: 2,
    buy_amount: 10.1,
    price_places: ".2f"
  },
  {
    id: 8,
    coin: "LINK",
    buy_market: "USDT",
    spread: 10,
    multiplier: 2,
    buy_amount: 10.1,
    price_places: ".4f"
  },
  {
    id: 9,
    coin: "MATIC",
    buy_market: "USDT",
    spread: 10,
    multiplier: 2,
    buy_amount: 10.1,
    price_places: ".6f"
  }
];

export const getAccounts = () => {
  let accounts = [
    {
      id: 1,
      title: "Account 1",
      slug: "account-1",
      market: [1, 2, 3, 4, 5, 6, 8, 9]
    },
    {
      id: 2,
      title: "Account 2",
      slug: "account-2",
      market: [2, 3, 4, 5, 6]
    },
    {
      id: 3,
      title: "Account 3",
      slug: "account-3",
      market: [1, 2, 5, 6]
    },
    {
      id: 4,
      slug: "account-4",
      title: "Account 4",
      market: [1, 2, 6, 7]
    }
  ];

  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove(accounts);
    }, 2000);
  });
};
export const supported_markets = [
  "USDT",
  "TUSD",
  "BTC",
  "BNB",
  "ETH",
  "USDC",
  "PAX",
  "BUSD",
  "XRP",
  "TRX"
];

const number_grades = ["0", "1", "2", "3", "4", " 5", "6", "7", "8", "9"];

export const hiddenFields = [
  "sell_amount",
  "sell_market",
  "monthly_profit",
  "purchased_price",
  "trades",
  "expected_rise_point",
  "decimal_places",
  "price_places"
];
export let formFields = [
  { name: "coin", label: "Coin", forNew: true },
  { name: "buy_market", label: "Buy Market", options: supported_markets },
  { name: "sell_market", label: "Sell Market", options: supported_markets },
  { name: "budget", label: "Budget" },
  { name: "buy_amount", label: "Buy Amount", bulk: true },
  { name: "sell_amount", label: "Sell Amount", bulk: true },
  { name: "multiplier", label: "Multiplier", bulk: true },
  {
    name: "max_trade_count",
    label: "Max Trade Count",
    bulk: true,
    options: [1, 2, 3, 4, 5]
  },
  { name: "market_type", label: "Market Type", options: supported_markets },
  { name: "spread", label: "Spread" },
  { name: "spread_multiplier", label: "Spread Multiplier", bulk: true },
  { name: "monthly_profit", label: "Monthly Profit" },
  { name: "decimal_places", label: "Decimal Places", options: number_grades },
  { name: "price_places", label: "Price Places", options: number_grades },
  {
    name: "time_interval",
    label: "Time Interval",
    options: ["Hourly", "Daily"]
  },
  {
    name: "take_profits",
    label: "Take Profits",
    field_type: "radio",
    bulk: true
  },
  { name: "profit_value", label: "Profit Value" },
  // { name: "one_way", label: "Is One Way", field_type: "radio" },
  { name: "pause", label: "Pause Market", field_type: "radio", bulk: true },
  // { name: "invest_value", label: "Invest Value" },
  {
    name: "margin_support",
    label: "Margin Support",
    field_type: "radio",
    bulk: true
  },
  { name: "margin_multiplier", label: "Margin Multiplier" },
  {
    name: "margin_market",
    label: "Margin Market",
    options: ["USDT", "BTC"],
    bulk: true
  },
  {
    name: "market_condition",
    options: ["bull", "bear"],
    label: "Market Conditions"
  }
];

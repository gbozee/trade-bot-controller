let ENDPOINT = "https://tuteria.ngrok.io/api";
function toTitle(slug) {
  return slug.replace("_", " ");
}
const _getProductionAccounts = async () => {
  let response = await fetch(`${ENDPOINT}/accounts`);
  let result = await response.json();
  return result.map((j, i) => {
    return { ...j, id: i + 1, slug: j.name, title: toTitle(j.name) };
  });
};
export const getAccounts = (kind = "dev") => {
  return _getProductionAccounts();
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
  "price_places",
  "margin_market"
  // "market_condition"
];
export let formFields = [
  { name: "coin", label: "Coin", forNew: true },
  { name: "buy_market", label: "Buy Market", options: supported_markets },
  { name: "sell_market", label: "Sell Market", options: supported_markets },
  { name: "budget", label: "Budget" },
  { name: "buy_amount", label: "Buy Amount" },
  { name: "sell_amount", label: "Sell Amount" },
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
  { name: "profit_value", label: "Profit Value", bulk: true },
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
    bulk: true,
    options: ["bull", "bear"],
    label: "Market Conditions"
  }
];
function getMarket(account_id, with_markets = false) {
  return getAccounts().then(data => {
    let acc = data.find(x => x.slug === account_id);
    if (with_markets) {
      return { markets: acc.markets, accounts: data };
    }
    return acc.markets;
  });
}
function addNewMarket(config, account, id) {
  let dataToSave = {
    id: id,
    coin: config.coin,
    buy_market: config.buy_market || "USDT",
    spread: config.spread || 3.28,
    multiplier: config.multiplier || 1,
    buy_amount: config.buy_amount || 10.1,
    price_places: config.price_places || "%.2f",
    pause: config.pause || false
  };
  return getMarket(account, true).then(({ markets, accounts }) => {
    let configs = markets;
    let transformed = configs.map(
      x => `${x.coin.toLowerCase()}/${x.buy_market.toLowerCase()}`
    );
    if (
      !transformed.includes(
        `${dataToSave.coin.toLowerCase()}/${dataToSave.buy_market.toLowerCase()}`
      )
    ) {
      configs = [...configs, dataToSave];
      return {
        dataToSave: {
          ...dataToSave,
          market_label: () => {
            return `${dataToSave.coin}/${dataToSave.buy_market}`;
          }
        },
        accounts
      };
    } else {
      throw new Error(
        `${dataToSave.coin}/${dataToSave.buy_market} already exists`
      );
    }
  });
}
function analyzeMarket(marketConfig) {
  return fetch(`${ENDPOINT}/analyze-market`, {
    method: "POST",
    body: JSON.stringify(marketConfig),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.text());
}
function updateExistingMarket(oldConfig, newConfig, account) {
  return new Promise((resolve, reject) => {
    resolve();
  });
}
export const adapter = { getAccounts, getMarket, addNewMarket, analyzeMarket ,updateExistingMarket,};

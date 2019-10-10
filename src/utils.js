import React, { useState, useEffect } from "react";

export const AppContext = React.createContext();

const getAccounts = () => {
  let accounts = [
    {
      id: 1,
      title: "Account 1",
      slug: "account-1",
      market: [
        "BTC/USDT",
        "ETH/USDT",
        "XRP/USDT",
        "XMR/USDT",
        "ONT/USDT",
        "ETH/BTC"
      ]
    },
    {
      id: 2,
      title: "Account 2",
      slug: "account-2",
      market: ["ETH/USDT", "XRP/USDT", "XMR/USDT", "ONT/USDT", "ETH/BTC"]
    },
    {
      id: 3,
      title: "Account 3",
      slug: "account-3",
      market: ["BTC/USDT", "ETH/USDT", "ONT/USDT", "ETH/BTC"]
    },
    {
      id: 4,
      slug: "account-4",
      title: "Account 4",
      market: ["BTC/USDT", "ETH/USDT", "ETH/BTC", "BNB/USDT"]
    }
  ];

  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove(accounts);
    }, 2000);
  });
};

const configs = [
  { market: "BTC/USDT", spread: 7, multiplier: 2, buy_amount: 10.1 },
  { market: "ETH/USDT", spread: 4, multiplier: 3, buy_amount: 10.1 },
  { market: "XRP/USDT", spread: 7, multiplier: 2, buy_amount: 10.1 },
  { market: "XMR/USDT", spread: 12, multiplier: 2, buy_amount: 10.1 },
  { market: "ONT/USDT", spread: 9, multiplier: 2, buy_amount: 10.1 },
  { market: "ETH/BTC", spread: 15, multiplier: 2, buy_amount: 0.0014 },
  { market: "BNB/USDT", spread: 10, multiplier: 2, buy_amount: 10.1 }
];

function getMarketConfig(market) {
    let y = configs
      .filter(x => x.market === market)
      .map(x => {
        return x;
      });
    return y;
  }


export const AppProvider = ({ children }) => {
  let [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    loadAccounts();
  }, []);

  function loadAccounts() {
    setLoading(true);
    return getAccounts().then(data => {
      setAccounts(data);
      setLoading(false);
      return data;
    });
  }

  function getMarket(account_id) {
    setLoading(true);
    return loadAccounts().then(data => {
      let acc = data.find(x => x.slug === account_id);
      setMarkets(acc.market);
      setLoading(false);
      return acc.market;
    });
  }

  const appValue = {
    markets: markets,
    getMarket,
    loading,
    accounts,
    configs,
    getMarketConfig
  };
  return <AppContext.Provider value={appValue}>{children}</AppContext.Provider>;
};

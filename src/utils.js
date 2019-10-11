import React, { useState, useEffect, useRef } from "react";

export const AppContext = React.createContext();

export function useWebSockets(market, price_places = ".0f", currency) {
  let places = price_places.replace(".", "").replace("f", "");
  const connections = useRef({});
  let [allStreams, setAllStreams] = useState([
    market.toLowerCase() + "@ticker"
  ]);
  let [prices, setPrices] = useState("Loading");
  let [percent, setPercent] = useState();

  function _disconnectSocketStreams(streams) {
    streams = streams.join("/");
    let connection = btoa(streams);
    // console.log(connections.current[connection].readyState)
    // console.log(WebSocket.OPEN)
    if (connections.current[connection].readyState === WebSocket.OPEN) {
      connections.current[connection].close();
    }
  }
  useEffect(() => {
    function addPrice(newPrice) {
      let result = parseFloat(newPrice.c).toFixed(parseInt(places, 10));
      setPrices(result);
      setPercent(parseFloat(newPrice.P));
    }
    function _connectSocketStreams(streams) {
      streams = streams.join("/");
      let connection = btoa(streams);
      connections.current[connection] = new WebSocket(
        ` wss://stream.binance.com:9443/ws/${streams}`
        // `wss://stream.binance.com:9443/stream?streams=${streams}`
        // `wss://stream.binance.com:9443/stream?streams=${streams}`
      );
      connections.current[connection].onmessage = evt => {
        let result = JSON.parse(evt.data);
        // console.log(evt.data);
        addPrice(result);
      };
      connections.current[connection].onerror = evt => {
        console.error(evt);
      };
    }
    _connectSocketStreams(allStreams);
    return () => {
      _disconnectSocketStreams(allStreams);
    };
  }, [allStreams, places]);
  return {
    prices,
    percent
  };
}

const configs = [
  {
    id: 1,
    coin: "BTC",
    buy_market: "USDT",
    spread: 7,
    multiplier: 2,
    buy_amount: 10.1,
    price_places: ".2f"
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

const getAccounts = () => {
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
      let _markets = acc.market
        .map(mk => configs.find(x => x.id === mk))
        .map(x => ({
          ...x,
          market_label: () => {
            return `${x.coin}/${x.buy_market}`;
          }
        }));
      setMarkets(_markets);
      setLoading(false);
      return _markets;
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

import React, { useState, useEffect, useRef } from "react";
import { getAccounts, configs, supported_markets, formFields,hiddenFields } from "./data";
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

export const AppProvider = ({ children }) => {
  let [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [markets, setMarkets] = useState([]);
  const [uniqueId, setUniqueId] = useState();
  const [allMarkets, setAllMarkets] = useState(configs);

  useEffect(() => {
    setAllMarkets(configs);
    loadAccounts();
  }, []);

  function loadAccounts() {
    if (accounts.length !== 0) {
      return new Promise(resolve => {
        resolve(accounts);
      });
    }
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
        .map(mk => allMarkets.find(x => x.id === mk))
        .map(x => ({
          ...x,
          market_label: () => {
            return `${x.coin}/${x.buy_market}`;
          }
        }));
      // setMarkets(_markets);
      setLoading(false);
      return _markets;
    });
  }
  function getUniqueId() {
    let lastId = uniqueId || 10;
    lastId++;
    setUniqueId(lastId);
    return lastId;
  }
  // function getMarketConfig(market) {
  //   let foundMarketConfig = markets.find(x => x.market_label() === market);
  //   return foundMarketConfig;
  // }
  function getFormFields(isBulk) {
    if (isBulk === "bulk") {
      return formFields.filter(x => x.bulk);
    }
    return formFields;
  }

  function getFormResult(config, account) {
    // console.log(config);
    let id = getUniqueId();
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

    return new Promise((resolve, reject) => {
      setAllMarkets([...allMarkets, dataToSave]);
      let newAccounts = accounts.map(acc => {
        if (acc.slug === account) {
          return { ...acc, market: [...acc.market, id] };
        }
        return acc;
      });
      setAccounts(newAccounts);
      resolve({...dataToSave,market_label: () => {
        return `${dataToSave.coin}/${dataToSave.buy_market}`;
      }});
    });
  }

  const appValue = {
    // markets: markets,
    getMarket,
    loading,
    accounts,
    configs,
    hiddenFields,
    // getMarketConfig,
    supported_markets,
    getFormFields,
    getFormResult
  };
  return <AppContext.Provider value={appValue}>{children}</AppContext.Provider>;
};

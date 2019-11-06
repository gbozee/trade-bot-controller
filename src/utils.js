import React, { useState, useEffect, useRef } from "react";
import {
  getAccounts,
  configs,
  supported_markets,
  formFields,
  hiddenFields
} from "./data";
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

export function useMarketData(prices, market, full_market) {
  let [coinValue, setCoinValue] = useState();
  let [tradeInfo, setTradeInfo] = useState({});
  let [loaded, setLoaded] = useState(false);
  let places = market.price_places;

  useEffect(() => {
    if (prices !== "Loading") {
      getTradeInfoFormMarket(full_market, prices).then(
        ({ coinValue, tradeValue }) => {
          setCoinValue(coinValue);
          setTradeInfo(tradeValue);
          setLoaded(true);
          console.log(market);
        }
      );
    }

    function change2num(places) {
      let s = places.replace("f", "").replace(".", "");
      let f = parseFloat(s);
      return f;
    }

    let decimal_places= change2num(places)

    function getTradeInfoFormMarket(market_name, _prices) {
      return new Promise((resolve, reject) => {
        let result = determineSellValue(_prices);
        resolve({
          coinValue: 24,
          tradeValue: {
            buy_amount: _prices,
            sell_amount: result.price.toFixed(decimal_places),
            buy_value: (market.buy_amount * market.multiplier).toFixed(decimal_places),
            sell_value: result.value.toFixed(decimal_places)
          }
        });
      });
    }
    function determineSellValue(currentPrice) {
      let workingSpread = market.spread * (market.spread_multiplier || 1);
      let buy_amount = (market.buy_amount || 10.1) * (market.multiplier || 1);
      let currentQuantity = buy_amount / parseFloat(currentPrice);
      let sellPrice = parseFloat(currentPrice) + workingSpread;
      // console.log({ workingSpread, buy_amount, currentQuantity, sellPrice });
      let sellValue = currentQuantity * sellPrice;
      return { price: sellPrice, value: sellValue };
    }
  }, [prices, full_market, market, places]);
  return {
    coinValue,
    tradeInfo,
    loaded
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
  function addNewMarket(config, account) {
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
      let transformed = allMarkets.map(
        x => `${x.coin.toLowerCase()}/${x.buy_market.toLowerCase()}`
      );
      if (
        !transformed.includes(
          `${dataToSave.coin.toLowerCase()}/${dataToSave.buy_market.toLowerCase()}`
        )
      ) {
        setAllMarkets([...allMarkets, dataToSave]);
        let newAccounts = accounts.map(acc => {
          if (acc.slug === account) {
            return { ...acc, market: [...acc.market, id] };
          }
          return acc;
        });
        setAccounts(newAccounts);
        resolve({
          ...dataToSave,
          market_label: () => {
            return `${dataToSave.coin}/${dataToSave.buy_market}`;
          }
        });
      } else {
        reject(`${dataToSave.coin}/${dataToSave.buy_market} already exists`);
      }
    });
  }
  function getFormResult(config, account, markets) {
    // console.log(config);

    return addNewMarket(config, account);
  }
  function bulkUpdateMarkets(markets, account) {
    return new Promise((resolve, reject) => {
      let updatedMarkets = allMarkets.map(_market => {
        let exists = markets.find(m => m.slug === _market.slug);
        if (exists) {
          return exists;
        }
        return _market;
      });
      setAllMarkets(updatedMarkets);
      resolve();
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
    getFormResult,
    bulkUpdateMarkets
  };
  return <AppContext.Provider value={appValue}>{children}</AppContext.Provider>;
};

import React, { useState, useEffect, useRef } from "react";
import { configs, supported_markets, formFields, hiddenFields } from "./data";
export const AppContext = React.createContext();

export { useMarketData, useWebSockets } from "./hooks";

export const AppProvider = ({ children, adapter }) => {
  let [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [markets, setMarkets] = useState([]);
  const [uniqueId, setUniqueId] = useState();
  const [allMarkets, setAllMarkets] = useState([]);

  useEffect(() => {
    // setAllMarkets(configs);
    loadAccounts();
  }, []);

  function loadAccounts() {
    // if (accounts.length !== 0) {
    //   return new Promise(resolve => {
    //     resolve({ data: accounts, markets: allMarkets });
    //   });
    // }
    setLoading(true);
    return adapter.getAccounts().then(data => {
      setAccounts(data);
      // setAllMarkets(data.markets);
      setLoading(false);
      return data;
    });
  }
  function getMarket(account_id) {
    setLoading(true);
    return adapter.getMarket(account_id).then(markets => {
      setLoading(false);
      return markets.map(x => ({
        ...x,
        market_label: () => {
          return `${x.coin}/${x.buy_market}`;
        }
      }));
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
    return adapter
      .addNewMarket(config, account, getUniqueId())
      .then(({ accounts, dataToSave }) => {
        setAccounts(account);
        return {
          ...dataToSave,
          market_label: () => {
            return `${dataToSave.coin}/${dataToSave.buy_market}`;
          }
        };
      });
  }
  function getFormResult(config, account, markets) {
    // console.log(config);

    return addNewMarket(config, account);
  }
  function bulkUpdateMarkets(markets, account) {
    return adapter.bulkUpdateMarkets(markets, account);
    // return new Promise((resolve, reject) => {
    //   let updatedMarkets = allMarkets.map(_market => {
    //     let exists = markets.find(m => m.slug === _market.slug);
    //     if (exists) {
    //       return exists;
    //     }
    //     return _market;
    //   });
    //   setAllMarkets(updatedMarkets);
    //   resolve();
    // });
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

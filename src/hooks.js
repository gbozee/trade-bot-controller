import React, { useState, useEffect, useRef } from "react";

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

    let decimal_places = change2num(places);

    function getTradeInfoFormMarket(market_name, _prices) {
      return new Promise((resolve, reject) => {
        let result = determineSellValue(_prices);
        resolve({
          coinValue: 24,
          tradeValue: {
            buy_amount: _prices,
            sell_amount: result.price.toFixed(decimal_places),
            buy_value: (market.buy_amount * market.multiplier).toFixed(
              decimal_places
            ),
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
  let info = {
    buy_amount: tradeInfo.buy_amount,
    sell_amount: tradeInfo.sell_amount,
    buy_value: tradeInfo.buy_value,
    sell_value: tradeInfo.sell_value,
    coin_value: coinValue,
    spread: market.spread * (market.spread_multiplier || 1),
 
  };

  return {
    info,
    loaded
  };
}

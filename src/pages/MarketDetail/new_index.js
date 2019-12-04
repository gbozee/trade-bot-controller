import React, { useEffect, useState, useContext } from "react";
import { Box, Flex, Spinner, useToast } from "@chakra-ui/core";
import { NavigationBar, SubNavigationBar } from "../../components";

import { useNotification, useGetData, useAccountMarket } from "../../hooks";
import { MarketTransaction } from "./MarketTransaction";
import { MarketAnalyzer } from "./MarketAnalyzer";
import { AppContext } from "../../utils";

/**
 * {
  "result": {
    "sell_price": 4.320399999999999,
    "purchase_coins": 162.02203499675957,
    "diff": 3.7031999999999994,
    "buys": [
      {
        "price": 0.56,
        "quantity": 18.03,
        "dollar": 10.1
      },
      {
        "price": 0.503,
        "quantity": 20.07,
        "dollar": 10.1
      },
      {
        "price": 0.446,
        "quantity": 22.64,
        "dollar": 10.1
      }
    ],
    "sells": [
      {
        "price": 0.674,
        "quantity": 22.64,
        "dollar": 15.259
      },
      {
        "price": 0.731,
        "quantity": 20.07,
        "dollar": 14.671
      },
      {
        "price": 0.788,
        "quantity": 18.03,
        "dollar": 14.208
      }
    ],
    "re_buys": {
      "price": 0.674,
      "quantity": 7.8,
      "dollar": 5.2572
    },
    "re_sells": {
      "price": 0.56,
      "quantity": 17.86,
      "dollar": 10
    },
    "remaining": 101.28203499675956,
    "gained": 222.76203499675958,
    "bought_coins": 60.74,
    "sold_coins": 60.74,
    "mined": 0.0,
    "buy_amount": 10.1,
    "sell_amount": 10.1,
    "minimum_trades": 10,
    "pair": 3,
    "multiplier": 1,
    "spread_multiplier": 1,
    "_range": 0.057,
    "equal": "quantity",
    "price_places": "%.3f",
    "decimal_places": "%.2f",
    "use_new": false
  }
}
 */

/**
 * ONT Config
Buy Trades

Price: 0.56	Q:18.03	Dollar:10.1
Price: 0.503	Q:20.07	Dollar:10.1
Price: 0.446	Q:22.63	Dollar:10.1

Sell Trades

Price: 0.674	Q:22.63	Dollar:15.253
Price: 0.731	Q:20.07	Dollar:14.671
Price: 0.788	Q:18.03	Dollar:14.208

Config

buy_amount: 10.1
sell_amount: 10.1
minimum_trades: 10
pair: 3
multiplier: 1
spread_multiplier: 1
_range: 0.057
equal: quantity
price_places: %.3f
decimal_places: %.2f
use_new: False

Profit for 3 pairs
6.916

Trades to Complete
2

Proposed Budget
20.2

Fees in BNB
0.0026613264472609417
 */

function buildMarketSummaryString(passedObject, result) {
  let _result = "";
  _result += `${passedObject.coin.toUpperCase()} Config
  Buy Trades
  ${result.buys
    .map(buy => `Price: ${buy.price} Q:${buy.quantity} Dollar:${buy.dollar}`)
    .join("\n")}
  
  Sell Trades
  ${result.sells
    .map(buy => `Price: ${buy.price} Q:${buy.quantity} Dollar:${buy.dollar}`)
    .join("\n")}

    Config

    buy_amount: ${passedObject.buy_amount}
    sell_amount: ${result.sell_amount}
    minimum_trades:${result.minimum_trades}
    pair: ${result.pair}
    multiplier: ${passedObject.multiplier}
    spread_multiplier: ${passedObject.spread_multiplier}
    _range: ${result._range}
    equal: ${result.equal}
    price_places: ${result.price_places}
    decimal_places:${result.decimal_places}
    use_new: ${result.use_new}

    Profit for ${result.pair} pairs 
    ${result.profit}

    Trades to Complete
    ${result.trades}

    Proposed Budget
    ${passedObject.budget}

    Fees in BNB
    0.0026613264472609417
  `;

  return _result.replace(/\n/g, "<br/>");
}
export const MarketDetail = ({ match, history }) => {
  let { messages } = useNotification();
  let { market, account } = match.params;
  let { data, analyzeMarket, analyzeLoader, transactionLoader } = useGetData(
    market
  );
  let [textBlob, setTextBlob] = useState({});
  let { accounts = [], getFormResult } = useContext(AppContext);

  const pageProps = useAccountMarket(account);
  const toast = useToast();
  let remaingRoutes = account
    ? [
        {
          name: account,
          path: `/${account}/markets`
        },
        {
          name: market,
          path: `/${account}/markets/${market}`,
          current: true
        }
      ]
    : [
        {
          name: market,
          path: `/markets/${market}`,
          current: true
        }
      ];
  let routes = [{ name: "Home", path: "/" }, ...remaingRoutes];
  let { getSpecificMarket } = pageProps;
  let defaultConfig = getSpecificMarket(market); // {coin,market} "ethbtc"
  console.log({ defaultConfig });
  function onsubmit(config, type) {
    let passedObject = {
      coin: config.coin,
      market: config.buy_market,
      buy_amount: config.buy_amount,
      spread_multiplier: config.spread_multiplier,
      multiplier: config.multiplier,

      sell_market: config.sell_market,
      budget: config.budget,
      sell_amount: config.sell_amount,
      max_trade_count: config.max_trade_count,
      spread: config.spread,
      take_profits: config.take_profits,
      margin_support: config.margin_support,
      margin_market: config.margin_market,
      interval: config.interval,
      format: "json"
    };
    analyzeMarket(passedObject).then(data => {
      let text = buildMarketSummaryString(passedObject, data.json);
      setTextBlob({ text, json: data.json });
    });
    // setConfig(newConfig);
  }

  function displayToast(description) {
    toast({
      title: "Markets transferred",
      description,
      status: "success",
      duration: 5000,
      isClosable: true
    });
  }

  function onCreateMarket(values) {
    return getFormResult(values, account).then(() => {
      // display toast
      // clear the cache of the account markets.
      displayToast(`Market has been created `);
      // redirecting back to the account page.
      console.log("redirect")
    });

  }

  return (
    <Box className="App">
      <NavigationBar title="Market Detail" />
      <Box px={6} pt={3}>
        <SubNavigationBar routes={routes} />
      </Box>
      <flex px={6}>
        <Flex p={"20px"} justifyContent="space-between">
          {account ? (
            <Flex direction="column" flex={1} mr={2}>
              {transactionLoader ? (
                <Box textAlign="center" mt={20}>
                  <Spinner alignSelf="center" textAlign="center" />
                </Box>
              ) : (
                <MarketTransaction messages={messages} data={data} />
              )}
            </Flex>
          ) : null}
          <MarketAnalyzer
            {...{
              analyzeLoader,
              symbol: market,
              textBlob,
              defaultConfig,
              onsubmit,
              onCreateMarket,
              accounts,
              account
            }}
          />
        </Flex>
      </flex>
    </Box>
  );
};

// get the list of running trades
// display the completed trades filterable by from and to date
// ability to determine new spread multiplier or multiplier to use
// ability to cancel all running trades so that a new one is recreated

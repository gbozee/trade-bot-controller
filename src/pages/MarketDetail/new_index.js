import React, { useEffect, useState } from "react";
import { Box, Flex, Spinner } from "@chakra-ui/core";
import { NavigationBar, SubNavigationBar } from "../../components";

import { useNotification, useGetData, useAccountMarket } from "../../hooks";
import { MarketTransaction } from "./MarketTransaction";
import { MarketAnalyzer } from "./MarketAnalyzer";

export const MarketDetail = ({ match }) => {
  let { messages } = useNotification();
  let { market, account } = match.params;
  let { data, analyzeMarket, analyzeLoader, transactionLoader } = useGetData(
    market
  );
  let [textBlob, setTextBlob] = useState({text: "This is love", json: {}});
  const pageProps = useAccountMarket(match.params.account);
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

  function onsubmit(config,type) {
    analyzeMarket({
      coin: config.coin,
      market: config.buy_market,
      buy_amount: config.buy_amount,
      spread_multiplier: config.spread_multiplier,
      multiplier: config.multiplier,
      interval: config.interval,
      format: "json"
    }).then(data => {
      console.log(typeof(data));
      console.log((data));
      setTextBlob(data);
    });
    // setConfig(newConfig);
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
                <MarketTransaction messages={messages} data={data}/>
              )}
            </Flex>
          ) : null}
          <MarketAnalyzer
            {...{ analyzeLoader, textBlob, defaultConfig, onsubmit }}
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

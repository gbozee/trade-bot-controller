import React, { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/core";
import { NavigationBar, SubNavigationBar } from "../../components";

import { useNotification, useGetData } from "../../hooks";
import { MarketTransaction } from "./MarketTransaction";
import { MarketAnalyzer } from "./MarketAnalyzer";
// import { MarketAnalyzer } from "./MarketAnalyzer";
// import { MarketAnalyzer } from "./MarketAnalyzer";

export const MarketDetail = ({ match, location }) => {
  let { messages } = useNotification();
  let { market, account } = match.params;
  let { data, analyzeMarket, analyzeLoader } = useGetData(market);
  let remaingRoutes = account
    ? [
        {
          name: account,
          path: `/${account}/markets`
        },
        {
          name: market,
          path: `/markets/${market}`,
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
  let markets = ["usdt", "tusd", "busd", "usdc", "usds"];
  function getCoin() {
    let foundMarket = markets.find(x => {
      let b = market.includes(x);
      return b;
    });
    if (foundMarket) {
      let coin = market.slice(0, -foundMarket.length);
      return { coin, market: foundMarket };
    } else {
      return {};
    }
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
              <MarketTransaction messages={messages} data={data} />
            </Flex>
          ) : null}
          <MarketAnalyzer
            {...getCoin()}
            {...{ analyzeLoader, analyzeMarket }}
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

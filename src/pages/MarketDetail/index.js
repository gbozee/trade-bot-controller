import React from "react";
import { Box, Flex } from "@chakra-ui/core";
import { NavigationBar, SubNavigationBar } from "../../components";
import { MarketAnalyzer } from "./MarketAnalyzer";
import { MarketTransaction } from "./MarketTransaction";

export const MarketDetail = ({ match, location }) => {
  let { market } = match.params;
  let routes = [
    { name: "Home", path: "/" },
    {
      name: "Account",
      path: `/${(location.state || {}).account_id}/markets`
    },
    {
      name: market,
      path: `/markets/${market}`,
      current: true
    }
  ];

  return (
    <Box className="App">
      <NavigationBar title="Market Detail" />
      <Box px={6} pt={3}>
        <SubNavigationBar routes={routes} />
      </Box>
      <Box px={6}>
        <Flex justifyContent="space-between">
          <MarketTransaction />

          <MarketAnalyzer />
        </Flex>
      </Box>
    </Box>
  );
};

// get the list of running trades
// display the completed trades filterable by from and to date
// ability to determine new spread multiplier or multiplier to use
// ability to cancel all running trades so that a new one is recreated

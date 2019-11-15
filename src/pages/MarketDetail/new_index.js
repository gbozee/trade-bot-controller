import React from "react";
import { Box, Flex } from "@chakra-ui/core";
import { NavigationBar, SubNavigationBar } from "../../components";

import matchSorter from "match-sorter";
import { useNotification } from "../../hooks";
import { MarketTransaction } from "./MarketTransaction";
import { MarketAnalyzer } from "./MarketAnalyzer";
// import { MarketAnalyzer } from "./MarketAnalyzer";
// import { MarketAnalyzer } from "./MarketAnalyzer";

// Create an editable cell renderer

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val;

let textBlob = `------------Profit per trade ---------------\n
0.042083333333333334\n
Buy Trades\n

Price: 0.3532   Q:0.31147       Dollar:0.11\n
Price: 0.3001   Q:0.36652       Dollar:0.11\n
Price: 0.2471   Q:0.4452        Dollar:0.11\n


Sell Trades\n

Price: 0.4592   Q:0.31147       Dollar:0.143\n
Price: 0.5123   Q:0.36652       Dollar:0.1878\n
Price: 0.5653   Q:0.4452        Dollar:0.2517\n


Config\n\n

buy_amount: 0.11\n
sell_amount: 0.11\n
minimum_trades: 10\n
pair: 3\n
multiplier: 1\n
spread_multiplier: 40\n
_range: 0.001326\n
equal: quantity\n
price_places: %.4f\n
decimal_places: %.5f\n


Profit for 3 pairs\n
0.12625\n

Trades to Complete\n
397\n

Proposed Budget\n
43.67\n

Fees in $\n
0.08734`;
export const MarketDetail = ({ match, location }) => {
  let { messages } = useNotification();
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
  const columns = React.useMemo(
    () => [
      {
        id: "selection",
        // The header can use the table's getToggleAllRowsSelectedProps method
        // to render a checkbox
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <div>
            <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }) => (
          <div>
            <input type="checkbox" {...row.getToggleRowSelectedProps()} />
          </div>
        )
      },
      {
        Header: "Date",
        accessor: "date"
      },
      {
        Header: "Market",
        accessor: "market"
      },
      {
        Header: "Amount",
        accessor: "amount"
      },
      {
        Header: "Profit",
        accessor: "profit"
      }
    ],
    []
  );
  let data = [
    { date: "2019-10-01", market: "ETHUSDT", amount: 45.323, profit: 2.3 },
    { date: "2019-10-01", market: "ETHUSDT", amount: 45.323, profit: 2.3 },
    { date: "2019-10-01", market: "ETHUSDT", amount: 45.323, profit: 2.3 },
    { date: "2019-10-01", market: "ETHUSDT", amount: 45.323, profit: 2.3 },
    { date: "2019-10-01", market: "ETHUSDT", amount: 45.323, profit: 2.3 },
    { date: "2019-10-01", market: "ETHUSDT", amount: 45.323, profit: 2.3 },
    { date: "2019-10-01", market: "ETHUSDT", amount: 45.323, profit: 2.3 },
    { date: "2019-10-01", market: "ETHUSDT", amount: 45.323, profit: 2.3 },
    { date: "2019-10-01", market: "ETHUSDT", amount: 45.323, profit: 2.3 },
    { date: "2019-10-01", market: "ETHUSDT", amount: 45.323, profit: 2.3 },
    { date: "2019-10-01", market: "ETHUSDT", amount: 45.323, profit: 2.3 },
    { date: "2019-10-01", market: "ETHUSDT", amount: 45.323, profit: 2.3 },
    { date: "2019-10-01", market: "ETHUSDT", amount: 45.323, profit: 2.3 },
    { date: "2019-10-01", market: "ETHUSDT", amount: 45.323, profit: 2.3 }
  ];
  return (
    <Box className="App">
      <NavigationBar title="Market Detail" />
      <Box px={6} pt={3}>
        <SubNavigationBar routes={routes} />
      </Box>
      <flex px={6}>
        <Flex justifyContent="space-between">
          <Flex direction="column" flex={1} mr={2}>
            <MarketTransaction
              messages={messages}
              data={data}
              columns={columns}
            />
          </Flex>

          <MarketAnalyzer textBlob={textBlob} />
        </Flex>
      </flex>
    </Box>
  );
};

// get the list of running trades
// display the completed trades filterable by from and to date
// ability to determine new spread multiplier or multiplier to use
// ability to cancel all running trades so that a new one is recreated

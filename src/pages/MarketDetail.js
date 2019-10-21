import React from "react";
import {
  Box,
  Flex,
  IconButton,
  Input,
  FormControl,
  FormLabel,
  Code,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Button
} from "@chakra-ui/core";
import { NavigationBar, SubNavigationBar } from "../components";
import {
  useTable,
  usePagination,
  useSortBy,
  useGroupBy,
  useRowSelect
} from "react-table";
import matchSorter from "match-sorter";

// Create an editable cell renderer

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val;

function Table({ columns, data, updateMyData, disablePageResetOnDataChange }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page
    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, groupBy, expanded, filters, selectedRowPaths }
  } = useTable(
    {
      columns,
      data,
      // nestExpandedRows: true,
      initialState: { pageIndex: 0, pageSize: 5 },
      updateMyData,
      // We also need to pass this so the page doesn't change
      // when we edit the data
      disablePageResetOnDataChange
    },
    useGroupBy,
    useSortBy,
    usePagination,
    useRowSelect
  );

  // Render the UI for your table
  return (
    <Box width={["100%", "100%", "50%"]}>
      <Box as="table" borderTop="1px solid" width={"100%"} {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <Box
                  as="th"
                  p={"0.5em"}
                  borderBottom={"1px solid black"}
                  borderRight={"1px solid black"}
                  {...column.getHeaderProps()}
                >
                  <div>
                    <span {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {/* Add a sort direction indicator */}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </div>
                </Box>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(
            (row, i) =>
              prepareRow(row) || (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <Box
                        as="td"
                        p={"0.5em"}
                        borderBottom={"1px solid black"}
                        borderRight={"1px solid black"}
                        textAlign="center"
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </Box>
                    );
                  })}
                </tr>
              )
          )}
        </tbody>
      </Box>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <Flex my={3} className="pagination" justifyContent="space-between">
        <Box>
          <IconButton
            icon="arrow-left"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          />{" "}
          <IconButton
            icon="arrow-back"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          />{" "}
          <IconButton
            icon="arrow-forward"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          />{" "}
          <IconButton
            icon="arrow-right"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          />{" "}
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
        </Box>
        <Box display="flex" alignSelf="center">
          {/* <Flex>
            Go to page:{" "}
            <Input
              type="number"
              size="sm"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </Flex> */}
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </Box>
      </Flex>
      <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
              groupBy,
              expanded,
              filters,
              selectedRowPaths
            },
            null,
            2
          )}
        </code>
      </pre>
    </Box>
  );
}
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
export const MarketDetail = ({ match }) => {
  let { market } = match.params;
  let routes = [
    { name: "Home", path: "/" },
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
      <Box px={6}>
        <Box display="flex" width="15em" mb={3}>
          <FormControl>
            <FormLabel>From</FormLabel>
            <Input size="sm" type="date" placeholder="from" />
          </FormControl>
          <FormControl>
            <FormLabel>to</FormLabel>
            <Input size="sm" type="date" placeholder="to" />
          </FormControl>
          <IconButton alignSelf="flex-end" size="sm" icon="search" />
        </Box>
        <Flex justifyContent="space-between">
          <Table columns={columns} data={data} />
          <Box display="flex" flex={0.95} flexDirection="column">
            <Box flexWrap="wrap" display="flex">
              <FormControl width="42%" mb={1} mx={3} isRequired>
                <FormLabel htmlFor="market">Market</FormLabel>
                <Select>
                  <option>USDT</option>
                </Select>
              </FormControl>
              <FormControl mb={1} width="42%" mx={3} isRequired>
                <FormLabel htmlFor="market">Buy Amount</FormLabel>
                <Input />
              </FormControl>
              <FormControl width="100%" mb={1} mx={3} isRequired>
                <FormLabel htmlFor="market">Multiplier</FormLabel>
                <Slider defaultValue={30}>
                  <SliderTrack />
                  <SliderFilledTrack />
                  <SliderThumb size={6}>
                    <Box color="tomato" as={Text} children={4} />
                  </SliderThumb>
                </Slider>
              </FormControl>
              <FormControl width="100%" mb={1} mx={3} isRequired>
                <FormLabel htmlFor="market">Spread Multiplier</FormLabel>
                <Slider defaultValue={30}>
                  <SliderTrack />
                  <SliderFilledTrack />
                  <SliderThumb size={6}>
                    <Box color="tomato" as={Text} children={4} />
                  </SliderThumb>
                </Slider>
              </FormControl>
              <Button mb={5}>Submit</Button>
            </Box>
            <Code maxHeight={"500px"} overflowY="scroll" pl={2} py={4}>
              {textBlob.split("\n").map(text => {
                if (text.trim() === "") {
                  return <br />;
                }
                return text;
              })}
            </Code>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

// get the list of running trades
// display the completed trades filterable by from and to date
// ability to determine new spread multiplier or multiplier to use
// ability to cancel all running trades so that a new one is recreated

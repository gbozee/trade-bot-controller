import React from "react";
import {
  Popover,
  PopoverTrigger,
  Link,
  Box,
  Flex,
  PopoverContent,
  Text,
  Stat,
  StatLabel,
  StatHelpText,
  StatArrow,
  StatNumber,
  PseudoBox,
  Stack
} from "@chakra-ui/core";
import { useWebSockets, useMarketData } from "../../utils";
function PopItem({ name, value }) {
  return (
    <Flex justifyContent="space-between">
      <Text bold>{name}</Text>
      <Text>{value}</Text>
    </Flex>
  );
}
function MarketPopover({ children, items = [] }) {
  return <>{children}</>
  // return (
  //   <Popover trigger="hover">
  //     <PopoverTrigger>
  //       <Link _hover={{ outline: "none" }}>{children}</Link>
  //     </PopoverTrigger>

  //     <PopoverContent border="0" zIndex={4} width="400px">
  //       <Box p={5}>
  //         {items.map(item => (
  //           <PopItem key={item.name} name={item.name} value={item.value} />
  //         ))}
  //       </Box>
  //     </PopoverContent>
  //   </Popover>
  // );
}

export const MarketWithStat = ({
  children,
  selected = false,
  onSelect,
  market
}) => {
  let full_market = `${market.coin.toUpperCase()}${market.buy_market.toUpperCase()}`;
  let places = market.price_places;
  const { prices, percent } = useWebSockets(
    `${full_market}`,
    market.price_places
  );
  const { info, loaded } = useMarketData(prices, market, full_market);
 

  function _format(value) {
    if (value) {
      return value.toLocaleString();
    }
    return value;
  }
  let itemsToDisplay = [
    {
      name: "Buy_amount",
      value: info.buy_value
    },
    { name: "Spread", value: info.spread },
    { name: "Remaining coin", value: info.coin_value }
  ];
  return (
    <MarketPopover items={itemsToDisplay}>
      <PseudoBox
        // flexBasis={["40%", "40%", "30%", "20%"]}
        my={[3, 1, 3]}
        textAlign="center"
        mx={3}
        py={1}
        tabIndex={0}
        height={["6em"]}
        borderWidth="3px"
        onClick={onSelect}
        _hover={{ cursor: "pointer" }}
        _focus={{ boxShadow: "outline" }}
        style={{ backgroundColor: selected ? "teal" : "inherit" }}
      >
        <Stat>
          <Flex justifyContent="space-between">
            <StatLabel>
              {prices === "Loading" ? "Loading" : "$" + prices}
            </StatLabel>
            {loaded && (
              <>
                <StatLabel>B-${_format(info.buy_amount)}</StatLabel>
                <StatLabel>S-${_format(info.sell_amount)}</StatLabel>
              </>
            )}
          </Flex>
          <Flex justifyContent="space-between" alignSelf="flex-end">
            <StatNumber>{children}</StatNumber>
            {percent ? (
              <StatHelpText alignSelf="flex-end">
                <StatArrow type={percent > 0 ? "increase" : "decrease"} />
                {percent}%
              </StatHelpText>
            ) : null}
          </Flex>
          {loaded && (
            <Flex justifyContent="space-between">
              <StatLabel textAlign="center">
                {prices !== "Loading" && info.coin_value ? (
                  <StatLabel>
                    {info.coin_value}/
                  
                 {(info.coin_value * prices).toFixed(places)}  
                  </StatLabel>
                ) : (
                  "..."
                )}
              </StatLabel>
              <StatLabel>B-${info.buy_value}</StatLabel>
              <StatLabel>S-${info.sell_value}</StatLabel>
            </Flex>
          )}
        </Stat>
      </PseudoBox>
    </MarketPopover>
  );
};

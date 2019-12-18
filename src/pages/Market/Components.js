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
  Stack,
  Grid,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Checkbox
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
  return <>{children}</>;
}
export const MarketWithStat = ({
  children,
  selected = false,
  onSelect,
  market,
  update
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
        {selected && update ? (
          <Stat>
            <Flex justifyContent="space-between">
              <StatLabel>Updating..........</StatLabel>
            </Flex>
            <Flex justifyContent="space-between" alignSelf="flex-end">
              <StatNumber>{children}</StatNumber>
            </Flex>
          </Stat>
        ) : (
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
        )}
      </PseudoBox>
    </MarketPopover>
  );
};

export function GridLayout({
  update,
  items,
  onSelect,
  selectedMarkets = [],
  ...rest
}) {
  return (
    <Box>
      <Grid
        pt={5}
        templateColumns={["repeat(2, 1fr)", "repeat(3,1fr)", "repeat(4,1fr)"]}
        gap={[1, 2, 3]}
        maxHeight="400px"
        {...rest}
      >
        {items.map(market => {
          return (
            <MarketWithStat
              key={market.market_label()}
              onSelect={() => {
                onSelect(market.market_label());
              }}
              market={market}
              selected={selectedMarkets.includes(market.market_label())}
              update={update}
            >
              {market.market_label()}
            </MarketWithStat>
          );
        })}
      </Grid>
    </Box>
  );
}

export const MenuComponent = ({
  options = [],
  defaultText = "Menu",
  buttonProps = {},
  menuProps = {},
  renderItem = x => x,
  onMenuItemClick = () => {},
  withCheckbox = false,
  isSelected = () => false
}) => {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon="chevron-down" {...buttonProps}>
        {defaultText}
      </MenuButton>
      <MenuList {...menuProps}>
        {options.map((param, index) => {
          let child = (
            <MenuItem key={index} onClick={() => onMenuItemClick(param)}>
              {renderItem(param)}
            </MenuItem>
          );
          if (withCheckbox) {
            return (
              <Checkbox key={index} defaultIsChecked={isSelected(param)} ml={3}>
                {child}
              </Checkbox>
            );
          }
          return child;
        })}
      </MenuList>
    </Menu>
  );
};

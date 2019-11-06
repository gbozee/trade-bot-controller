import React, { useState, useContext, useEffect } from "react";
import {
  PseudoBox,
  Box,
  Flex,
  Button,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stat,
  StatLabel,
  StatHelpText,
  StatArrow,
  StatNumber,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Spinner,
  Checkbox,
  useToast
} from "@chakra-ui/core";
import { AppContext, useWebSockets, useMarketData } from "../../utils";
import {
  NavigationBar,
  SubNavigationBar,
  ControlButton
} from "../../components";
import { FormComponent, useFormState } from "./FormComponent";

const MarketWithStat = ({ children, selected = false, onSelect, market }) => {
  let full_market = `${market.coin.toUpperCase()}${market.buy_market.toUpperCase()}`;
  let places = market.price_places;
  const { prices, percent } = useWebSockets(`${full_market}`,market.price_places);
  const { coinValue, tradeInfo, loaded } = useMarketData(prices, market,full_market);

  function _format(value) {
    if (value) {
      return value.toLocaleString();
    }
    return value;
  }
  let info = {
    buy_amount: tradeInfo.buy_amount,
    sell_amount: tradeInfo.sell_amount,
    buy_value: tradeInfo.buy_value,
    sell_value: tradeInfo.sell_value,
    coin_value: coinValue
  };
  return (
    <PseudoBox
      flexBasis={["40%", "40%", "30%", "20%"]}
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
              {prices !== "Loading" && coinValue ? (
                <StatLabel>
                  {info.coin_value}/{(info.coin_value * prices).toFixed(places)}
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
  );
};

const SidebarDrawer = ({
  isOpen,
  onClose,
  btnRef,
  market,
  marketInfo = {},
  hiddenFields = [],
  formFields,
  onSubmit
}) => {
  const { onSaveHandler, ...formParams } = useFormState(marketInfo, onSubmit);
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent maxHeight="100vh" overflowY="scroll">
        <DrawerCloseButton onClick={onClose} />
        <DrawerHeader>
          {!market ? `Create new market` : `Edit ${market} market`}
        </DrawerHeader>
        <DrawerBody>
          <Flex
            justifyContent={["space-between", "space-between", "flex-start"]}
            flexGrow={0.3}
            flexDirection={["column"]}
            // mx={3}
            my={5}
          >
            <FormComponent
              {...formParams}
              {...{ formFields, hiddenFields, market }}
              // getData
            />
          </Flex>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button color="blue" onClick={onSaveHandler}>
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
const MenuComponent = ({
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
function ConfigurationComponent({ params, onSubmit }) {
  let [selectedFields, setSelectedFields] = useState([]);
  const {
    displayText,
    setDisplayText,
    onSaveHandler,
    ...formParams
  } = useFormState(undefined, onSubmit, false);

  return (
    <>
      <Flex direction="column">
        <Flex mt={5} mx={3}>
          <MenuComponent
            withCheckbox
            menuProps={{ display: "flex", flexDirection: "column" }}
            defaultText="Configurations"
            onMenuItemClick={item => {
              setDisplayText(false);
              if (selectedFields.includes(item.value)) {
                setSelectedFields(selectedFields.filter(x => x !== item.value));
              } else {
                setSelectedFields([...selectedFields, item.value]);
              }
            }}
            options={params.map(x => ({ name: x.label, value: x.name }))}
            renderItem={x => x.name}
            isSelected={item => {
              return selectedFields.includes(item.value);
            }}
          />
        </Flex>
        <Flex
          justifyContent={["space-between", "space-between", "flex-start"]}
          flexGrow={0.3}
          flexDirection={["column", "row"]}
          // mx={3}
          flexWrap="wrap"
          my={5}
        >
          <FormComponent
            componentProps={{ mb: 4 }}
            formFields={params.filter(x => selectedFields.includes(x.name))}
            {...formParams}
            fieldsToUnhide={["pause", "profit_value"]}
          />
        </Flex>
        {displayText ? (
          <Box
            bg="tomato"
            w="50%"
            p={4}
            color="teal.900"
            ml={40}
            textAlign="center"
            fontWeight="semibold"
          >
            Set values from the configurations
          </Box>
        ) : null}

        <Button
          position={["relative", "fixed"]}
          style={{ bottom: "2em" }}
          mt={["2em", "inherit"]}
          variantColor="blue"
          width="50%"
          onClick={onSaveHandler}
          mb={3}
        >
          Submit
        </Button>
      </Flex>
    </>
  );
}
export function Market({ match, history }) {
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const {
    loading,
    getMarket,
    hiddenFields,
    getFormFields,
    getFormResult,
    bulkUpdateMarkets
  } = useContext(AppContext);
  const [markets, setMarkets] = useState([]);
  let [selectedMarkets, setSelectedMarkets] = useState([]);
  let [newEditItem, setNewEditItem] = useState();
  let [filteredItem, setFilteredItem] = useState(" ");

  function getFilterItem(filteredItem) {
    if (filteredItem === " ") {
      return markets;
    } else {
      let filteredmarket = markets.filter(x => x.buy_market === filteredItem);
      return filteredmarket;
    }
  }

  function addOrRemoveMarkets(_market) {
    if (selectedMarkets.includes(_market)) {
      let filtered = selectedMarkets.filter(x => x !== _market);
      setSelectedMarkets(filtered);
      if (filtered.length === 1) {
        setNewEditItem(filtered[0]);
      } else {
        setNewEditItem(undefined);
      }
    } else {
      setSelectedMarkets([...selectedMarkets, _market]);
      setNewEditItem(_market);
    }
  }
  useEffect(() => {
    // console.log(isOpen);
  });
  useEffect(() => {
    getMarkets();
  }, []);
  function getMarkets() {
    getMarket(match.params.account).then(mk => {
      setMarkets(mk);
    });
  }
  function displayToast(description) {
    toast({
      title: "Markets saved",
      description,
      status: "success",
      duration: 3000,
      isClosable: true
    });
  }
  function onSubmit(config) {
    console.log(config);
    if (selectedMarkets.length > 0) {
      let foundMarkets = markets.map(x => {
        if (selectedMarkets.includes(x.market_label())) {
          return { ...x, ...config };
        }
        return x;
      });
      return bulkUpdateMarkets(foundMarkets, match.params.account).then(() => {
        setMarkets(foundMarkets);
        onClose();
        displayToast("The markets have been saved");
      });
    } else {
      /**
       * return new Promise((resovle,reject)=>reject(["coin",'market']))
       */
      return getFormResult(config, match.params.account).then(fetchedMarket => {
        setMarkets([...markets, fetchedMarket]);
        displayToast(`${fetchedMarket.market_label()} has been saved`);
        onClose();
        return {};
      });
    }
  }
  let routes = [
    { name: "Home", path: "/" },
    {
      name: match.params.account,
      path: `/${match.params.account}/markets`,
      current: true
    }
  ];
  return (
    <Box className="App">
      <NavigationBar title="Main Account Markets">
        <MenuComponent
          defaultText="Filter"
          options={["All", "BTC", "USDT", "ETH ", "BNB"]}
          value={filteredItem}
          onMenuItemClick={x => {
            setFilteredItem(x);
          }}
          menuProps={{ background: "teal" }}
          buttonProps={{ variantColor: "teal", variant: "solid" }}
        />
        {isOpen && (
          <SidebarDrawer
            {...{
              isOpen,
              onClose,
              btnRef,
              hiddenFields,
              market: newEditItem,
              marketInfo: markets.find(x => x.market_label() === newEditItem),
              formFields: getFormFields(),
              onSubmit
            }}
          />
        )}
      </NavigationBar>
      <Box px={6} pt={3}>
        <SubNavigationBar routes={routes} />
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" height="20em">
          <Spinner alignSelf="center" />
        </Box>
      ) : (
        <Flex
          flexDirection="column"
          justifyContent={["space-between", "inherit"]}
          mx={3}
          minHeight="90vh"
        >
          <Box pt={5}>
            <Stack
              isInline
              spacing={8}
              justifyContent={["space-between", "space-between", "flex-start"]}
              flexWrap="wrap"
              maxHeight="400px"
              overflowY="scroll"
            >
              {getFilterItem(filteredItem).map(market => {
                return (
                  <MarketWithStat
                    key={market.market_label()}
                    onSelect={() => {
                      addOrRemoveMarkets(market.market_label());
                    }}
                    market={market}
                    selected={selectedMarkets.includes(market.market_label())}
                  >
                    {market.market_label()}
                  </MarketWithStat>
                );
              })}
            </Stack>
          </Box>
          {selectedMarkets.length > 1 ? (
            <ConfigurationComponent
              params={getFormFields("bulk")}
              onSubmit={onSubmit}
            />
          ) : (
            <>
              <ControlButton
                btnRef={btnRef}
                onClick={selectedMarkets.length === 1 ? onOpen : onOpen}
                icon={selectedMarkets.length === 1 ? "edit" : "add"}
                variantColor="pink"
                style={{
                  right: "2em",
                  bottom: "2em"
                }}
              />
              {selectedMarkets.length === 1 && (
                <ControlButton
                  btnRef={btnRef}
                  onClick={selectedMarkets.length === 1 ? onOpen : onOpen}
                  icon={"calendar"}
                  variantColor="teal"
                  style={{
                    right: "6em",
                    bottom: "2em"
                  }}
                />
              )}
            </>
          )}
        </Flex>
      )}
    </Box>
  );
}

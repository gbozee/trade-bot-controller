import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Spinner,
  Checkbox,
  useToast,
  Text,
  Grid,
  Switch,
  FormLabel,
  PseudoBox
} from "@chakra-ui/core";
import { Switch as RouterSwitch, Route } from "react-router-dom";
import { AppContext } from "../../utils";
import {
  NavigationBar,
  SubNavigationBar,
  ControlButton,
  XModal,
  SearchInput
} from "../../components";
import { FormComponent, useFormState } from "./FormComponent";
import { MarketWithStat } from "./Components";
import { Link } from "react-router-dom";
import { useAccountMarket, useStorage } from "../../hooks";
import { useSerchInput } from "../../components/SearchInput";
const SidebarDrawer = ({
  isOpen,
  onClose,
  btnRef,
  market,
  markets,
  marketInfo = {},
  hiddenFields = [],
  formFields,
  onSubmit,
  account
}) => {
  const { onSaveHandler, ...formParams } = useFormState(marketInfo, onSubmit);
  return (
    <XModal
      style={{
        height: "29rem"
        // marginTop: "12rem",
        // marginRight: "0rem",
      }}
      onSubmit={onSaveHandler}
      onClose={onClose}
      isOpen={isOpen}
      title={!market ? `Create new market` : `Edit ${market} market`}
      finalFocusRef={btnRef}
      submitButtonProps={!market ? { display: "none" } : { display: "inherit" }}
      cancelButtonProps
    >
      <Flex
        justifyContent={["space-between", "space-between", "flex-start"]}
        flexGrow={0.3}
        flexDirection={["column"]}
        // mx={3}
        my={5}
      >
        {!market ? (
          <SearchInput
            boxStyle={{}}
            to={x =>
              `/${account}/markets/detail/${x.toLowerCase()}?market=true`
            }
            markets={markets.map(x => `${x.coin}${x.buy_market}`)}
          />
        ) : (
          <FormComponent
            {...formParams}
            {...{ formFields, hiddenFields, market }}
            // getData
          />
        )}
      </Flex>
    </XModal>
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
  } = useFormState(undefined, onSubmit, false, true);
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
function GridLayout({
  update,
  items,
  onSelect,
  selectedMarkets = [],
  ...rest
}) {
  return (
    <>
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
      {/* <Box pt={5}>
        <Stack
          isInline
          spacing={8}
          justifyContent={["space-between", "space-between", "flex-start"]}
          flexWrap="wrap"
          maxHeight="400px"
          overflowY="scroll"
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
              >
                {market.market_label()}
              </MarketWithStat>
            );
          })}
        </Stack>
      </Box> */}
    </>
  );
}
export function DeleteAccountMarket({
  selectedMarkets,
  setSelectedMarkets,
  setRefresh,
  btnRef,
  markets,
  deleteMarket,
  match
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  function onDeleteHandler(e) {
    let market = markets
      .filter(x => x.market_label() === selectedMarkets[0])
      .map(x => x);
    console.log(market);
    deleteMarket(market[0], match.params.account);
    onClose();
    setSelectedMarkets([]);
    setRefresh();
  }
  return (
    <Box>
      {selectedMarkets.length === 1 && (
        <ControlButton
          btnRef={btnRef}
          onClick={onOpen}
          icon={"delete"}
          variantColor="blue"
          style={{
            right: "14em",
            bottom: "2em"
          }}
        />
      )}
      <XModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onDeleteHandler}
        ButtonTitle="Confirm"
        title
        submitButtonProps={{ variantColor: "red" }}
      >
        <Box pb={6} ml={7}>
          Are you sure you want to delete this market
        </Box>
      </XModal>
    </Box>
  );
}
export function Market({ match, history }) {
  let [isListMode, setListMode] = useState(true);
  const toast = useToast();
  const pageProps = useAccountMarket(match.params.account);
  const { markets, loading, setMarkets, setRefresh } = pageProps;
  useEffect(() => {
    if (isListMode) {
      history.push(`${match.url}/list-mode`);
    } else {
      history.push(`${match.url}`);
    }
  }, [isListMode]);
  const {
    hiddenFields,
    getFormFields,
    getFormResult,
    deleteMarket,
    bulkUpdateMarkets,
    updateMarket,
    adapter
  } = useContext(AppContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  let [selectedMarkets, setSelectedMarkets] = useState([]);
  let [newEditItem, setNewEditItem] = useState();
  let [filteredItem, setFilteredItem] = useState(" ");
  let [updated, setUpdated] = useState(false);
  let [marketCoin, setMarketCoin] = useState([]);
  let [selected, setSelected] = useState();
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
    if (selectedMarkets.length > 1) {
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
      if (selectedMarkets.length === 1) {
        let oldMarketConfig = markets.find(
          x => x.market_label() === selectedMarkets[0]
        );
        if (oldMarketConfig) {
          updateMarket(oldMarketConfig, config, match.params.account).then(
            () => {
              let newMarkets = markets.map(x => {
                if (x.market_label() === oldMarketConfig.market_label()) {
                  return {
                    ...config,
                    market_label: () => `${config.coin}/${config.buy_market}`
                  };
                }
                return x;
              });
              setMarkets(newMarkets);
              displayToast(
                `${oldMarketConfig.market_label()} has been updated`
              );
              onClose();
              setSelectedMarkets([]);
            }
          );
        }
      } else {
        return getFormResult(config, match.params.account).then(
          fetchedMarket => {
            setMarkets([...markets, fetchedMarket]);
            displayToast(`${fetchedMarket.market_label()} has been saved`);
            onClose();
            return {};
          }
        );
      }
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
  function updatedMarket() {
    function displayToast(description) {
      toast({
        title: "Market Updated",
        description,
        status: "success",
        duration: 5000,
        isClosable: true
      });
    }
    setUpdated(true);
    console.log(selectedMarkets);
    return new Promise((reslove, reject) => {
      setTimeout(() => {
        reslove(setUpdated(false));
        setSelectedMarkets([]);
        displayToast(`${selectedMarkets} updated `);
      }, 3000);
    });
  }

  return (
    <Box className="App">
      <NavigationBar title="Main Account Markets">
        <Flex justify="center" align="center">
          <FormLabel htmlFor="email-alerts">Toggle List Mode</FormLabel>
          <Switch
            onChange={e => {
              setListMode(e.target.checked);
            }}
            isChecked={isListMode}
            id="email-alerts"
          />
        </Flex>
        <MenuComponent
          defaultText="Filter"
          options={["All", "BTC", "USDT", "ETH ", "BNB"]}
          value={filteredItem}
          onMenuItemClick={x => {
            setFilteredItem(x);
          }}
          menuProps={{ background: "teal" }}
          buttonProps={{
            variantColor: "teal",
            variant: "solid",
            marginRight: "4em"
          }}
        />
        <ControlButton
          btnRef={btnRef}
          onClick={setRefresh}
          icon={"repeat"}
          variantColor="blue"
          style={{
            right: "1em",
            position: "absolute"
          }}
        />
        {isOpen && (
          <SidebarDrawer
            {...{
              isOpen,
              onClose,
              markets,
              account: match.params.account,
              // btnRef,
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
        <>
          <RouterSwitch>
            <Route exact path={`${match.url}`}>
              <DetailView
                {...{
                  getFormFields,
                  addOrRemoveMarkets,
                  selectedMarkets,
                  updated,
                  markets,
                  filteredItem,
                  onSubmit
                }}
              />
            </Route>
            <Route exact path={`${match.url}/list-mode`}>
              <ListView activeMarkets={markets} adapter={adapter} />
            </Route>
          </RouterSwitch>
          {selectedMarkets.length > 1 ? null : (
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
                  as={Link}
                  to={`/${
                    match.params.account
                  }/markets/detail/${selectedMarkets[0]
                    .toLowerCase()
                    .replace("/", "")}`}
                  btnRef={btnRef}
                  icon={"calendar"}
                  variantColor="teal"
                  style={{
                    right: "6em",
                    bottom: "2em"
                  }}
                />
              )}
              {selectedMarkets.length === 1 && (
                <ControlButton
                  btnRef={btnRef}
                  onClick={updatedMarket}
                  icon={"repeat"}
                  variantColor="red"
                  style={{
                    right: "10em",
                    bottom: "2em"
                  }}
                />
              )}
              <DeleteAccountMarket
                {...{
                  deleteMarket,
                  selectedMarkets,
                  match,
                  btnRef,
                  markets,
                  setSelectedMarkets,
                  setRefresh
                }}
              />
            </>
          )}
        </>
      )}
    </Box>
  );
}
function ListView({
  activeMarkets = [],
  addOrRemoveMarkets,
  selectedMarkets,
  updated,
  adapter
}) {
  let { getValue, setValue, cachedAlternateMarket, allMarkets } = useStorage(
    "all-markets",
    adapter
  );
  // console.log()
  let [selectedCoin, setSelectedCoin] = useState();
  let [selectedCoinMarkets, setSelectedCoinMarkets] = useState([]);

  useEffect(() => {
    if (selectedCoin) {
      cachedAlternateMarket(selectedCoin).then(x => {
        console.log(x);
      });
    }
  }, [selectedCoin]);
  function coinButton(coin) {
    setSelectedCoin(coin);
  }
  function getCoin() {
    return activeMarkets.filter(
      (obj, index, self) =>
        index === self.findIndex(el => el["coin"] === obj["coin"])
    );
  }
  function getMarketFromCoin() {
    let filteredmarket = activeMarkets.filter(x => x.coin === selectedCoin);
    return filteredmarket;
  }
  let baseCoins = getCoin();
  return (
    <Box display="flex">
      <Box display="flex" flexDirection="column">
        {baseCoins.map(x => (
          <PseudoBox
            value={x.coin}
            as="button"
            py="1em"
            px="1em"
            mx="1em"
            my="0.2em"
            border="1px solid"
            boxShadow="md"
            rounded="md"
            _active={{ bg: "teal.700" }}
            _hover={{
              cursor: "pointer",
              background: "teal",
              color: "white",
              borderColor: "white"
            }}
            key={x.coin}
            background={selectedCoin === x.coin ? "teal" : "inherit"}
            color={selectedCoin === x.coin ? "white" : "inherit"}
            onClick={e => coinButton(x.coin)}
          >
            {x.coin}
          </PseudoBox>
        ))}
      </Box>
      {selectedCoin && (
        <Box borderLeft="1px solid">
          <Box borderBottom="1px solid">
            <Text fontSize="20px" color="tomato" textAlign="center">
              Active Market
            </Text>

            <Box display="flex" paddingBottom="10px">
              <GridLayout
                items={getMarketFromCoin()}
                onSelect={addOrRemoveMarkets}
                selectedMarkets={selectedMarkets}
                update={updated}
              />
            </Box>
          </Box>
          <Box borderBottom="1px solid">
            <Text fontSize="20px" color="tomato" textAlign="center">
              Non-active USD Market
            </Text>
            <Box display="flex" paddingBottom="10px">
              {["A", "B", "C", "D", "E"].map(x => (
                <PseudoBox
                  as="button"
                  py="1em"
                  px="1em"
                  mx="1em"
                  my="0.2em"
                  border="1px solid"
                  boxShadow="md"
                  rounded="md"
                  _hover={{
                    cursor: "pointer",
                    background: "teal",
                    color: "white",
                    borderColor: "white"
                  }}
                  key={x}
                  // to={x)}
                >
                  {x}
                </PseudoBox>
              ))}
            </Box>
          </Box>
          <Box>
            <Text fontSize="20px" color="tomato" textAlign="center">
              USD Market
            </Text>
            <Box display="flex">
              {["Femi", "Bola", "Bukky"].map(x => (
                <PseudoBox
                  as="button"
                  py="1em"
                  px="1em"
                  mx="1em"
                  my="0.2em"
                  border="1px solid"
                  boxShadow="md"
                  rounded="md"
                  _hover={{
                    cursor: "pointer",
                    background: "teal",
                    color: "white",
                    borderColor: "white"
                  }}
                  key={x}
                  // to={x)}
                >
                  {x}
                </PseudoBox>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
const DetailView = ({
  markets,
  filteredItem = " ",
  addOrRemoveMarkets,
  selectedMarkets,
  updated,
  getFormFields,
  onSubmit
}) => {
  function getFilterItem() {
    if (filteredItem === "All" || filteredItem === " ") {
      return markets;
    } else {
      let filteredmarket = markets.filter(x => x.buy_market === filteredItem);
      return filteredmarket;
    }
  }
  return (
    <Flex
      flexDirection="column"
      justifyContent={["space-between", "inherit"]}
      mx={3}
      minHeight="90vh"
    >
      {/*Grid layout for markets */}
      <GridLayout
        items={getFilterItem()}
        onSelect={addOrRemoveMarkets}
        selectedMarkets={selectedMarkets}
        update={updated}
        overflowY="scroll"
      />
      {selectedMarkets.length > 1 ? (
        <ConfigurationComponent
          params={getFormFields("bulk")}
          onSubmit={onSubmit}
        />
      ) : null}
    </Flex>
  );
};

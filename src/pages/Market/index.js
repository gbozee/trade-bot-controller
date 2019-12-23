import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Flex,
  useDisclosure,
  Spinner,
  useToast,
  Switch,
  FormLabel
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
import { MenuComponent } from "./Components";
import { Link } from "react-router-dom";
import { useAccountMarket } from "../../hooks";
import DetailView from "./DetailView";
import ListView from "./ListView";
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

export function DeleteAccountMarket({ selectedMarkets, onDelete, btnRef }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
        onSubmit={() => onDelete(onClose)}
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
export function Market({ match, history, location: { search } }) {
  const queryString = require("query-string");
  const parse = queryString.parse(search);
  const listModeUrl = parse["coin"];
  let [isListMode, setListMode] = useState(true);
  const toast = useToast();
  const {
    markets,
    loading,
    setMarkets,
    setRefresh,
    onCreateMarket,
    deleteSavedMarket
  } = useAccountMarket(match.params.account);
  useEffect(() => {
    let url = `${match.url}`;
    if (isListMode) {
      url += "/list-mode";
    }
    if (search) {
      url += search;
    }
    history.push(url);
  }, [isListMode]);
  const {
    hiddenFields,
    getFormFields,
    getFormResult,
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
    <>
      <Box className="App">
        <NavigationBar title="Main Account Markets">
          <Flex justify="center" align="center">
            <FormLabel htmlFor="email-alerts">Toggle List Mode</FormLabel>
            <Switch
              onChange={e => {
                setListMode(e.target.checked);
                // setRefresh();
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
              marginRight: "4em",
              visibility: isListMode ? "hidden" : "visible"
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
                <ListView
                  selectedMarkets={selectedMarkets}
                  activeMarkets={markets}
                  onCreateMarket={onCreateMarket}
                  addOrRemoveMarkets={addOrRemoveMarkets}
                  adapter={adapter}
                  account={match.params.account}
                  markets={markets}
                  setRefresh={setRefresh}
                  listModeUrl={listModeUrl}
                  history={history}
                  setSelectedMarkets={setSelectedMarkets}
                  setListMode={setListMode}
                />
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
                    onDelete: _onClose => {
                      console.log(selectedMarkets[0]);
                      deleteSavedMarket(selectedMarkets[0]).then(x => {
                        _onClose();
                        setSelectedMarkets([]);
                      });
                    },
                    selectedMarkets,
                    btnRef
                  }}
                />
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
}

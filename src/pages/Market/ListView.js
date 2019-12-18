import { ControlButton } from "../../components";
import { Box, Text, PseudoBox } from "@chakra-ui/core";
import { GridLayout } from "./Components";
import React, { useContext, useState, useEffect } from "react";
import { useStorage } from "../../hooks";
import { AppContext } from "../../utils";

function ListLayout({
  items,
  onSelect = x => {},
  selectedNonActive,
  text = "text"
}) {
  return (
    <Box
      borderBottom="1px solid"
      display={items.length < 1 ? "none" : "inherit"}
    >
      <Text fontSize="20px" color="tomato" textAlign="center">
        {text}
      </Text>
      <Box display="flex" paddingBottom="10px">
        {items.map(x => {
          return (
            <PseudoBox
              background={selectedNonActive === x ? "teal" : "inherit"}
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
              onClick={e => {
                onSelect(x);
              }}
            >
              {x}
            </PseudoBox>
          );
        })}
      </Box>
    </Box>
  );
}

function ListView({
  activeMarkets = [],
  addOrRemoveMarkets,
  selectedMarkets,
  updated,
  adapter,
  account,
  history,
  setRefresh,
  listModeUrl
}) {
  let { storage, cachedAlternateMarket } = useStorage("all-markets", adapter);
  let { getFormResult } = useContext(AppContext);
  let [selectedCoin, setSelectedCoin] = useState(listModeUrl);
  let [allMarket, setAllMarket] = useState([]);
  let [selectedNonActive, setSelectedNonActive] = useState();

  useEffect(() => {
    if (selectedCoin) {
      cachedAlternateMarket(selectedCoin).then(x => {
        setAllMarket(x);
      });
    }
  }, [selectedCoin]);
  function coinButton(coin) {
    setSelectedCoin(coin);
    setSelectedNonActive(undefined);
  }

  function onCreateMarket(values, account) {
    return getFormResult(values, account)
      .then(savedMarketValue => {
        let accountMarkets = storage.get(account);
        if (accountMarkets) {
          let newAccountMarkets = [...accountMarkets, savedMarketValue];
          storage.set(account, newAccountMarkets);
        }
      })
      .catch(error => {});
  }

  //get all the coins in the market without duplicate
  function baseCoins() {
    return activeMarkets.filter(
      (obj, index, self) =>
        index === self.findIndex(el => el["coin"] === obj["coin"])
    );
  }
  function getMarketFromCoin() {
    let filteredmarket = activeMarkets.filter(x => x.coin === selectedCoin);
    return filteredmarket;
  }

  function getUsdMarket() {
    let usd = allMarket.filter(x => x.includes("USD"));
    let coinMarket = getMarketFromCoin().map(x => `${x.coin}${x.buy_market}`);
    let filteredUsd = usd.filter(x => !coinMarket.includes(x));
    return filteredUsd;
  }
  function getNonUsdMarket() {
    let nonUsd = allMarket.filter(x => !x.includes("USD"));
    let coinMarket = getMarketFromCoin().map(x => `${x.coin}${x.buy_market}`);
    let filteredNonUsd = nonUsd.filter(x => !coinMarket.includes(x));
    return filteredNonUsd;
  }
  function getFirstDollarMarket() {
    let d_markets = ["usdt", "tusd", "usds", "usdc", "busd", "pax"];
    let dollarMarkets = baseCoins().filter(x => {
      return d_markets.includes(x.buy_market.toLowerCase());
    });
    if (dollarMarkets.length > 0) {
      return dollarMarkets[0];
    }
    return undefined;
  }
  function transferMarket() {
    let foundActiveDollarMarket = getFirstDollarMarket();
    if (foundActiveDollarMarket) {
      console.log(baseCoins());
      let buy_market = selectedNonActive.replace(
        foundActiveDollarMarket.coin,
        ""
      );
      let config = { ...foundActiveDollarMarket, buy_market };
      console.log(config);
      onCreateMarket(config, account)
        .then(() => {
          // history.push(`/${account}/markets/list-mode?coin=${config.coin}`);
          setRefresh();
        })
        .catch(error => {});
    } else {
    }
  }

  return (
    <Box>
      <Box display="flex">
        <Box display="flex" flexDirection="column">
          {baseCoins().map(x => (
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
        <Box>
          {selectedCoin && (
            <Box borderLeft="1px solid">
              <Box borderBottom="1px solid">
                <Text fontSize="20px" color="tomato" textAlign="center">
                  Active Market
                </Text>

                <GridLayout
                  items={getMarketFromCoin()}
                  onSelect={addOrRemoveMarkets}
                  selectedMarkets={selectedMarkets}
                  update={updated}
                />
              </Box>

              <ListLayout
                items={getNonUsdMarket()}
                text="Non-active USD Markets"
                onSelect={x => {
                  history.push(
                    `/${account}/markets/detail/${x.toLowerCase()}?market=true`
                  );
                }}
              />

              <ListLayout
                items={getUsdMarket()}
                text="USD Markets"
                onSelect={x => {
                  console.log(x);
                  setSelectedNonActive(x);
                }}
                selectedNonActive={selectedNonActive}
              />
            </Box>
          )}
        </Box>
      </Box>
      <Box>
        {selectedNonActive && (
          <ControlButton
            icon={"external-link"}
            variantColor="red"
            style={{
              right: "6em",
              bottom: "2em"
            }}
            onClick={transferMarket}
          />
        )}
      </Box>
    </Box>
  );
}

export default ListView;

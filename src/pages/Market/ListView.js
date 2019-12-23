import { ControlButton } from "../../components";
import { Box, Text, PseudoBox } from "@chakra-ui/core";
import { GridLayout, MarketWithStat } from "./Components";
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
          let market_label = `${}/${}`
          return (
            <MarketWithStat
              key={market_label}
              onSelect={() => {
                onSelect(market_label);
              }}
              market={{coin:"",prices:0}}
              // selected={selectedMarkets.includes(market.market_label())}
            >
              {market_label}
            </MarketWithStat>
          );
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
  onCreateMarket,
  account,
  history,
  setRefresh,
  listModeUrl,
  setSelectedMarkets,
  setListMode
}) {
  // let [activeMarkets, setActiveMarkets] = useState(all_markets);
  let { cachedAlternateMarket } = useStorage("all-markets", adapter);
  let { usd_markets } = useContext(AppContext);
  let [selectedCoin, setSelectedCoin] = useState(listModeUrl);
  let [allMarket, setAllMarket] = useState([]);
  let [selectedNonActive, setSelectedNonActive] = useState();

  useEffect(() => {
    // if (activeMarkets.length === 0) {
    //   setActiveMarkets(all_markets);
    // }
    if (!listModeUrl && activeMarkets.length > 0) {
      let first = activeMarkets[0];
      setSelectedCoin(first.coin);
    }
  }, [activeMarkets.length]);
  useEffect(() => {
    if (selectedCoin) {
      cachedAlternateMarket(selectedCoin).then(x => {
        setAllMarket(x);
      });
    }
  }, [selectedCoin]);

  //get all the coins in the market without duplicate
  function baseCoins() {
    return activeMarkets.filter(
      (obj, index, self) =>
        index === self.findIndex(el => el["coin"] === obj["coin"])
    );
  }
  function getMarketFromCoin() {
    let filteredmarket = activeMarkets.filter(x => x.coin === selectedCoin);
    return filteredmarket.map(o => ({
      ...o,
      market_label: () => `${o.coin}/${o.buy_market}`
    }));
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
  function getFirstDollarMarket(full_market) {
    let dollarMarkets = activeMarkets.filter(x => {
      return usd_markets.includes(x.buy_market.toLowerCase());
    });
    dollarMarkets = dollarMarkets.filter(x => {
      return full_market.startsWith(x.coin.toUpperCase());
    });

    if (dollarMarkets.length > 0) {
      return dollarMarkets[0];
    }
    return undefined;
  }
  function transferMarket() {
    let foundActiveDollarMarket = getFirstDollarMarket(selectedNonActive);
    if (foundActiveDollarMarket) {
      console.log(foundActiveDollarMarket);
      let buy_market = selectedNonActive.replace(
        foundActiveDollarMarket.coin.toUpperCase(),
        ""
      );
      console.log(buy_market);
      let config = { ...foundActiveDollarMarket, buy_market };
      console.log(config);
      onCreateMarket(config)
        .then(v => {
          // setSelectedCoin(config.coin);
        })
        .catch(error => {});
    } else {
      setListMode(false);
    }
  }
  function getAllCoins() {
    return baseCoins().map(x => x.coin);
  }
  return (
    <Box>
      <Box display="flex">
        <Box display="flex" flexDirection="column">
          {getAllCoins().map(x => (
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
              key={x}
              background={selectedCoin === x ? "teal" : "inherit"}
              color={selectedCoin === x ? "white" : "inherit"}
              onClick={e => setSelectedCoin(x)}
            >
              {x}
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
                  // isListMode={}
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
                  setSelectedMarkets([]);
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

// if there is no dollar market
// let the onselect work for both the detail and listmode view
//sent the usd markets list to the utils

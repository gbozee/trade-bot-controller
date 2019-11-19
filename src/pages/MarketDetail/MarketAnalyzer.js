import React, { useState } from "react";
import {
  Box,
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
import { checkPropTypes } from "prop-types";
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

let configs = {
  coin: "BTC",
  market: "USDT",
  buy_amount: 10.1,
  budget: 200,
  spread_multiplier: 1,
  multiplier: 1,
  profit: 10,
  interval: "1d"
};

export function MarketAnalyzer({ market }) {
  // let [config, setConfig] = useState({});
  let [config, setConfig] = useState(configs);

  console.log("this is the first" + config);
  //  console.log(buy_amount);

  const handleChange = input => e => {
    if (input === "multiplier || spread_multiplier") {
      // value= x;
    }
    let value = e.target.value;
    console.log(value);
    // value=value;
    let newConfig = { ...config, [input]: value };
    setConfig(newConfig);
  };
  const updateRange = input => x => {
    let newConfig = { ...config, [input]: x };
    setConfig(newConfig);
  };

  function onSaveHandler(event) {
    let defaultCoin = { coin: getCoin(market, markets) };
    let newConfig = { ...config, ...defaultCoin };
    setConfig(newConfig);
    console.log(newConfig);
  }

  let markets = ["usdt", "tusd", "busd", "usdc", "usds","btc"];
  function getCoin(market, markets) {
    let foundMarket = markets.find(x => {
      let b = market.includes(x);
      return b;
    });
    if (foundMarket) {
      let coin = market.slice(0, -foundMarket.length);
      return coin;
    } else {
      return undefined;
    }
  }

  return (
    <Box display="flex" flex={0.95} flexDirection="column">
      <Box flexWrap="wrap" display="flex">
        <FormControl width="42%" mb={1} mx={3} isRequired>
          <FormLabel htmlFor="market">Market</FormLabel>
          <Select>
            <option>USDT</option>
          </Select>
        </FormControl>
        <FormControl mb={1} width="42%" mx={3} isRequired>
          <FormLabel htmlFor="buy_amount">Buy Amount</FormLabel>
          <Input
            value={config.buy_amount}
            onChange={handleChange("buy_amount")}
            type="number"
            name="buy_amount"
          />
        </FormControl>
        <FormControl width="42%" mb={1} mx={3} isRequired display="none">
          <FormLabel htmlFor="interval">Interval</FormLabel>
          <Select>
            <option>1d</option>
          </Select>
        </FormControl>
        <FormControl mb={1} width="42%" mx={3} isRequired display="none">
          <FormLabel htmlFor="budget">Budget</FormLabel>
          <Input
            value={config.buy_amount}
            onChange={handleChange("budget")}
            type="number"
          />
        </FormControl>
        <FormControl mb={1} width="42%" mx={3} isRequired display="none">
          <FormLabel htmlFor="coin">Coin</FormLabel>
          <Input value={getCoin(market, markets)} name="coin" />
        </FormControl>
        <FormControl mb={1} width="42%" mx={3} isRequired display="none">
          <FormLabel htmlFor="buy_amount">Profit</FormLabel>
          <Input onChange={handleChange("profit")} type="number" />
        </FormControl>
        <FormControl width="100%" mb={1} mx={3} isRequired>
          <FormLabel htmlFor="multiplier">Multiplier</FormLabel>
          <Slider
            defaultValue={config.multiplier}
            onChange={updateRange("multiplier")}
          >
            <SliderTrack />
            <SliderFilledTrack />
            <SliderThumb size={6}>
              <Box color="tomato" as={Text} children={config.multiplier} />
            </SliderThumb>
          </Slider>
        </FormControl>
        <FormControl width="100%" mb={1} mx={3} isRequired>
          <FormLabel htmlFor="spread_multiplier">Spread Multiplier</FormLabel>
          <Slider
            defaultValue={config.multiplier}
            onChange={updateRange("spread_multiplier")}
          >
            <SliderTrack />
            <SliderFilledTrack />
            <SliderThumb size={6}>
              <Box
                color="tomato"
                as={Text}
                children={config.spread_multiplier}
              />
            </SliderThumb>
          </Slider>
        </FormControl>
        <Button mb={5} onClick={onSaveHandler}>
          Submit
        </Button>
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
  );
}

/**
 * should resturn results as {
	"coin":"BTC",
	"market":"USDT",
	"buy_amount": 10.1,
	"budget": 200,
	"spread_multiplier": 1,
	"multiplier": 1,
	"profit": 10,
	"interval": "1d"
}
 */

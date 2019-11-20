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
  Button,
  Spinner
} from "@chakra-ui/core";
import { checkPropTypes } from "prop-types";
import { MarketDetail } from "./new_index";
// import { supported_markets } from "../../data";

export function MarketAnalyzer({ coin, market, analyzeMarket, analyzeLoader }) {
  // let [config, setConfig] = useState({});
  let [loading, setLoading] = useState(false);
  let [config, setConfig] = useState({
    multiplier: 1,
    spread_multiplier: 1,
    market
  });

  let [textBlob, setTextBlob] = useState();
  //  console.log(buy_amount);

  const handleChange = input => e => {
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
    let newConfig = { ...config, ...coin };
    analyzeMarket({
      coin: "ont",
      market: "USDT",
      buy_amount: 10.1,
      spread_multiplier: 1,
      multiplier: 1,
      interval: "1d"
    }).then(data => {
      setTextBlob(data);
    });
    // setConfig(newConfig);
    // console.log(newConfig);
  }

  return (
    <Box display="flex" flex={0.95} flexDirection="column">
      <MarketDetailsForm
        handleChange={handleChange}
        config={config}
        updateRange={updateRange}
        onSaveHandler={onSaveHandler}
        market={market}
        coin={coin}
      />

      {analyzeLoader ? (
        <Box textAlign="center" mt={20}>
          <Spinner alignSelf="center" textAlign="center" />
        </Box>
      ) : (
        textBlob && (
          <Code
            width={"100%"}
            maxHeight={"500px"}
            overflowY="scroll"
            pl={2}
            py={4}
          >
            {textBlob.split("\n").map(text => {
              if (text.trim() === "") {
                return <br />;
              }
              return text;
            })}
          </Code>
        )
      )}
    </Box>
  );
}
export function MarketDetailsForm({
  config,
  handleChange,
  updateRange,
  onSaveHandler,
  market
}) 

{
   const supported_markets = [
    "usdt",
    "tusd",
    "btc",
    "bnb",
    "eth",
    "usdc",
    "pax",
    "busd",
    "xrp",
    "trx"
  ];
  return (
    <Box display="flex" flex={0.95} flexDirection="column">
      <Box flexWrap="wrap" display="flex">
        <FormControl width="42%" mb={1} mx={3} isRequired>
          <FormLabel htmlFor="market">Market</FormLabel>
          <Select 
          value={market}
          id="market"
          onChange={handleChange("market")}
          
          >
          
            {supported_markets.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
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
    </Box>
  );
}

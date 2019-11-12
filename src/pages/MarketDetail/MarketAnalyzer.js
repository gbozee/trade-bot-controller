import React from "react";
import {
  Box,
  Flex,
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
export const MarketAnalyzer = () => {
   return (
    <Flex justifyContent="space-between">
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
  );
};

// get the list of running trades
// display the completed trades filterable by from and to date
// ability to determine new spread multiplier or multiplier to use
// ability to cancel all running trades so that a new one is recreated

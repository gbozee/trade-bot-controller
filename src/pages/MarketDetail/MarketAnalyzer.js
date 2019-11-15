import React from "react";
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

export function MarketAnalyzer({ textBlob }) {
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
  );
}

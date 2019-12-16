import React, { useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Spinner,
  PseudoBox,
  Input,
  InputGroup,
  InputRightElement,
  IconButton
} from "@chakra-ui/core";
import { Link } from "react-router-dom";
import { useSerchInput, useWindowListener } from "../../hooks";
export const FormModal = ({}) => {
  const {
    filteredResult,
    searchLoading,
    onSearchDisplay,
    setFilteredResult
  } = useSerchInput();
  function onSearchChange(e) {
    let value = e.target.value;
    console.log(value);
    onSearchDisplay(value);
  }
  return (
    <>
      <Flex flex={0.8} direction="column">
        <InputGroup size="md">
          <Input
          Input focusBorderColor="tomato"
            color="black"
            onChange={onSearchChange}
            placeholder="Search for Market"
          />
          <InputRightElement>
            {searchLoading && <Spinner color="red.500" pr={4} />}
            <IconButton
              ml={4}
              variantColor="teal"
              aria-label="Search database"
              icon="search"
            />
          </InputRightElement>
        </InputGroup>
        {
          <MarketListItems
            onClose={() => setFilteredResult([])}
            markets={filteredResult}
          />
        }
      </Flex>
    </>
  );
};
function MarketListItems({ markets, onClose }) {
  const containerResultRef = useWindowListener(onClose);
  return (
    <Box
      ref={containerResultRef}
      style={}
    >
      {markets.map(x => (
        <PseudoBox
          as={Link}
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
          // _hover={{ borderColor: "gray.200", bg: "gray.200" }}
          // _focus={{
          //   outline: "none",
          //   bg: "white",
          //   boxShadow: "outline",
          //   borderColor: "gray.300",
          // }}
          //   style={{
          //     padding: "0.8em",
          //     border: "1px solid",
          //     ":hover": {
          //       cursor: "pointer",
          //       borderColor: "gray.200"
          //     },
          //   }}
          key={x}
          // onClick={(e)=>filteredResultHandler(e,{x})}
          to={`/markets/${x.toLowerCase()}`}
        >
          {x}
        </PseudoBox>
      ))}
    </Box>
  );
}

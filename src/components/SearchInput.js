import React, { useRef, useEffect, useState, useContext } from "react";
import {
  Flex,
  InputGroup,
  Input,
  InputRightElement,
  Spinner,
  IconButton,
  PseudoBox,
  Box
} from "@chakra-ui/core";
import { Link } from "react-router-dom";
import { AppContext } from "../utils";
import { useStorage, useAccountMarket } from "../hooks";
export function useSerchInput() {
  let { adapter, accounts } = useContext(AppContext);
  let [filteredResult, setFilteredResult] = useState([]);
  let [searchLoading, setSearchLoading] = useState(false);
  let { getValue, setValue, cachedAlternateMarket, allMarkets } = useStorage(
    "all-markets",
    adapter
  );
  function updateFilteredDisplay(coins, originalValue) {
    let promises = coins.map(x =>
      cachedAlternateMarket(x, () => {
        setSearchLoading(true);
      })
    );
    return Promise.all(promises).then(data => {
      let result = data
        .flatMap(x => x)
        .filter(o => {
          return o.toLowerCase().includes(originalValue.toLowerCase());
        });
      setFilteredResult(result);
      setSearchLoading(false);
    });
  }
  function compoundFilter(value) {
    let results = [value.slice(0, 3), value.slice(0, 4), value.slice(0, 5)]
      .map(o => {
        return allMarkets.filter(x =>
          x.toLowerCase().includes(o.toLowerCase())
        );
      })
      .flatMap(x => x);
    return [...new Set(results)];
  }
  function onSearchDisplay(value) {
    if (value.length > 1) {
      let result = compoundFilter(value);
      updateFilteredDisplay(result, value);
    } else {
      setFilteredResult([]);
    }
  }
  return {
    filteredResult,
    searchLoading,
    onSearchDisplay,
    setFilteredResult
  };
}
export function useWindowListener(onClose) {
  const containerResultRef = useRef();
  function onClick(e) {
    if (containerResultRef.current) {
      if (!containerResultRef.current.contains(e.target)) {
        onClose();
      }
    }
  }
  function onRemoveClick() {
    console.log("remove click");
  }
  useEffect(() => {
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("click", onRemoveClick);
    };
  }, []);
  return containerResultRef;
}
export function SearchInput({
  to = x => `/markets/${x.toLowerCase()}`,
  markets = {},
  boxStyle = { position: "absolute", width: "50%" },
  pseudoProps = {},
  ...props
}) {
  const {
    filteredResult,
    searchLoading,
    onSearchDisplay,
    setFilteredResult
  } = useSerchInput();
  const containerResultRef = useWindowListener(() => setFilteredResult([]));
  function getResult(markets) {
    if (markets.length > 0) {
      let result = filteredResult.filter(x => !markets.includes(x));
      return result;
    } else {
      return filteredResult;
    }
  }
  function onSearchChange(e) {
    let value = e.target.value;
    onSearchDisplay(value);
  }
  return (
    <Flex flex={0.8} direction="column">
      <InputGroup size="md">
        <Input
          color="black"
          onChange={onSearchChange}
          placeholder="Find Asset to Analyze"
        />
        <InputRightElement>
          {searchLoading && <Spinner color="red.500" pr={4} />}
          <IconButton
            ml={4}
            variantColor="blue"
            aria-label="Search database"
            icon="search"
          />
        </InputRightElement>
      </InputGroup>
      {
        <Box
          ref={containerResultRef}
          style={{
            display: "flex",
            flexDirection: "column",
            background: "white",
            color: "black",
            marginTop: "3em",
            ":hover": {
              // cursor: "pointer",
              borderColor: "gray.200"
            },
            ...boxStyle
          }}
        >
          {getResult(markets).map(x => (
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
              {...pseudoProps}
              key={x}
              to={to(x)}
            >
              {x}
            </PseudoBox>
          ))}
        </Box>
      }
    </Flex>
  );
}

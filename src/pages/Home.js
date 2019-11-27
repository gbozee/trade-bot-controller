import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Flex,
  Spinner,
  PseudoBox,
  Button,
  FormControl,
  FormLabel,
  Select,
  useToast,
  Input,
  InputGroup,
  InputRightElement,
  IconButton
} from "@chakra-ui/core";
import { useDisclosure } from "@chakra-ui/core";
import { NavigationBar, XModal } from "../components";
import { Link } from "react-router-dom";
import { AppContext } from "../utils";
import { useStorage } from "../hooks";

export function Home({ history }) {
  let { accounts = [], loading, adapter } = useContext(AppContext);
  let [accountMarkets, setAccountMarkets] = useState([]);
  let [formValues, setFormValues] = useState({});
  let [marketLoading, setMarketLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  function displayToast(description) {
    toast({
      title: "Markets transferred",
      description,
      status: "success",
      duration: 5000,
      isClosable: true
    });
  }
  function onSubmit() {
    if (formValues.from && formValues.market && formValues.to) {
      displayToast(
        `${formValues.market} has been transfered to ${formValues.to} `
      );
      // display toast message when successful
      adapter.transferMarket(formValues.market);
      onClose();
      setFormValues({});
    }
  }

  const onFromAccountChange = input => e => {
    let value = e.target.value;

    if (input === "from") {
      setMarketLoading(true);

      setFormValues({ ...formValues, [input]: value });
      adapter.getMarket(value).then(markets => {
        setAccountMarkets(markets);
        setMarketLoading(false);
      });
    } else {
      setFormValues({ ...formValues, [input]: value });
    }
  };

  function handleChange() {}

  return (
    <Box className="App">
      <NavigationBar title="Accounts">
        <SearchInput />

        <Button onClick={onOpen} variantColor="teal">
          Transfer Markets
        </Button>
      </NavigationBar>
      {loading ? (
        <Box display="flex" justifyContent="center" height="20em">
          <Spinner alignSelf="center" />
        </Box>
      ) : (
        <Flex flexDirection="column">
          {accounts.map(account => {
            return <AccountItem account={account} />;
          })}
        </Flex>
      )}
      <XModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        title="Transfer Market"
        submitButtonProps={{ variantColor: "blue" }}
      >
        <Box pb={6} ml={7}>
          <FormControl mb={1} mx={3} isRequired>
            <FormLabel htmlFor="Account">From Account</FormLabel>
            <Select
              value={formValues.from}
              onChange={onFromAccountChange("from")}
            >
              <option>Select Account</option>
              {accounts.map(option => (
                <option key={option.slug} value={option.slug}>
                  {option.title}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={1} mx={3} isRequired>
            <FormLabel htmlFor="market">{`Select Markets ${
              formValues.from ? `in ${formValues.from}` : ""
            } `}</FormLabel>
            <Flex>
              <Select
                value={formValues.market}
                isDisabled={marketLoading}
                onChange={e => {
                  setFormValues({ ...formValues, market: e.target.value });
                }}
              >
                <option>Select market</option>
                {accountMarkets.map(option => (
                  <option
                    key={`${option.coin}/${option.buy_market}`}
                    value={`${option.coin.toUpperCase()}${option.buy_market.toUpperCase()}`}
                  >
                    {`${option.coin}/${option.buy_market}`}
                  </option>
                ))}
              </Select>
              {marketLoading && (
                <Spinner ml={2} alignSelf="center" textAlign="center" />
              )}
            </Flex>
          </FormControl>
          <FormControl mb={1} mx={3} isRequired>
            <FormLabel htmlFor="Account">To Account</FormLabel>
            <Select value={formValues.to} onChange={onFromAccountChange("to")}>
              <option>Select Account</option>
              {accounts
                .filter(x => x.slug !== formValues.from)
                .map(option => (
                  <option key={option.slug} value={option.slug}>
                    {option.title}
                  </option>
                ))}
            </Select>
          </FormControl>
        </Box>
      </XModal>
    </Box>
  );
}

function SearchInput() {
  let { adapter } = useContext(AppContext);
  let [getValue, setValue, storage] = useStorage("all-markets");
  let [allMarkets, setAllMarkets] = useState([]);
  let [filteredResult, setFilteredResult] = useState([]);
  let [loading, setLoading] = useState(false);
  useEffect(() => {
    loadAllMarkets();
  }, []);
  function loadAllMarkets() {
    let result = getValue([]);
    if (result.length > 0) {
      setAllMarkets(result);
    } else {
      adapter.getAllAssets().then(data => {
        setValue(data);
        setAllMarkets(data);
      });
    }
  }
  function cachedAlternateMarket(coin) {
    let key = `fetchd-coin-${coin}`;
    let result = storage.get(key);
    if (result) {
      return new Promise(resolve => resolve(result));
    }
    setLoading(true);
    return adapter.getAlternateMarkets(coin).then(x => {
      storage.set(key, x);
      return x;
    });
  }
  function updateFilteredDisplay(coins) {
    let promises = coins.map(x => cachedAlternateMarket(x));
    return Promise.all(promises).then(data => {
      let result = data.flatMap(x => x);
      setFilteredResult(result);
      setLoading(false);
    });
  }
  function onSearchDisplay(e) {
    let value = e.target.value;
    if (value.length > 1) {
      let result = allMarkets.filter(x => {
        return x.toLowerCase().includes(value.toLowerCase());
      });
      updateFilteredDisplay(result);
    } else {
      setFilteredResult([]);
    }
  }
  return (
    <Flex flex={0.8} direction="column">
      <InputGroup size="md">
        <Input
          color="black"
          onBlur={() => {
            setFilteredResult([]);
          }}
          onChange={onSearchDisplay}
          placeholder="Find Asset to Analyze"
        />
        <InputRightElement>
          {loading && <Spinner color="red.500" pr={4} />}
          <IconButton
            ml={4}
            variantColor="blue"
            aria-label="Search database"
            icon="search"
          />
        </InputRightElement>
      </InputGroup>
      <Box
        style={{
          position: "absolute",
          background: "white",
          width: "50%",
          color: "black",
          marginTop: "3em",
          ":hover": {
            cursor: "pointer"
          }
        }}
      >
        {filteredResult.map(x => (
          <Box style={{ padding: "0.8em", border: "1px solid" }} key={x}>
            {x}
          </Box>
        ))}
      </Box>
    </Flex>
  );
}
function AccountItem({ account }) {
  return (
    <PseudoBox
      as={Link}
      py="1em"
      px="1em"
      mx="6em"
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
      to={`/${account.slug}/markets`}
    >
      {account.title}
    </PseudoBox>
  );
}

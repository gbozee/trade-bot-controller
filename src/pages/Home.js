import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useLayoutEffect
} from "react";
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
import { useStorage, useSerchInput } from "../hooks";

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
        <MarketListItems
          onClose={() => setFilteredResult([])}
          markets={filteredResult}
        />
      }
    </Flex>
  );
}
function MarketListItems({ markets, onClose }) {
  const containerResultRef = useRef();
  function onClick(e) {
    if (!containerResultRef.current.contains(e.target)) {
      onClose();
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
  return (
    <Box
      ref={containerResultRef}
      style={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        background: "white",
        width: "50%",
        color: "black",
        marginTop: "3em",
        ":hover": {
          // cursor: "pointer",
          borderColor: "gray.200"
        }
      }}
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

//Assignment create a hook for the search input
// Assignment make sure the search market can link to create market

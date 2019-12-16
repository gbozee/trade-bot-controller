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
import {
  NavigationBar,
  XModal,
  SearchInput,
  ControlButton
} from "../components";
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
        `${formValues.market} has been transferred to ${formValues.to} `
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

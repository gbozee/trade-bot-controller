import React, { useContext, useState } from "react";
import {
  Box,
  Flex,
  Spinner,
  PseudoBox,
  Button,
  FormControl,
  FormLabel,
  Select
} from "@chakra-ui/core";
import { useDisclosure } from "@chakra-ui/core";
import { NavigationBar, XModal } from "../components";
import { Link } from "react-router-dom";
import { AppContext } from "../utils";

export function Home({ history }) {
  let { accounts = [], loading, adapter } = useContext(AppContext);
  let [accountMarkets, setAccountMarkets] = useState([]);
  let [formValues, setFormValues] = useState({});
  let [marketLoading, setMarketLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  function onSubmit() {
    if (formValues.from && formValues.market && formValues.to) {
      // display toast message when successful
      adapter.transferMarket();
    }
  }
  function onFromAccountChange(e) {
    let value = e.target.value;
    if (value) {
      setMarketLoading(true);
      console.log(value);
      setFormValues({ ...formValues, from: value });
      adapter.getMarket(value).then(markets => {
        setAccountMarkets(markets);
        setMarketLoading(false);
        console.log(markets);
      });
    }
  }
  function handleChange() {}
  console.log(accounts);
  return (
    <Box className="App">
      <NavigationBar title="Accounts">
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
            <Select value={formValues.from} onChange={onFromAccountChange}>
              <option>Select Market</option>
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
                id="market"
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
            <FormLabel htmlFor="to_account">To Account</FormLabel>
            <Select
              value={formValues.to}
              id="to_account"
              onChange={e => {
                setFormValues({ ...formValues, to: e.target.value });
              }}
            >
              <option>Select Market</option>
              {/* Ensure that only acccounts that are not from from  */}
              {[].map(option => (
                <option key={option} value={option}>
                  {option}
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

import React, { useContext } from "react";
import { Box, Flex, Spinner, PseudoBox, Button } from "@chakra-ui/core";
import { NavigationBar } from "../components";
import { Link } from "react-router-dom";
import { AppContext } from "../utils";

export function Home({ history }) {
  //   const loading = false;
  //   const accounts = ["Account 1", "Account 2", "Account 3"];
  let { accounts, loading } = useContext(AppContext);
  function onOpenModal() {}
  console.log("this is " + accounts);
  return (
    <Box className="App">
      <NavigationBar title="Accounts">
        <Button onClick={onOpenModal}>Transfer Markets</Button>{" "}
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

/**
 * Assignment 1.
 * Implement the context fetching of the accounts from the provider.
 * also update each account in such a way that instead of just a string,
 * it consist of a slug, an id and a name.
 */

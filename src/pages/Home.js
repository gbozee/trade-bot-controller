import React, { useContext } from "react";
import {
  Box,
  Flex,
  Spinner,
  PseudoBox,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Select
} from "@chakra-ui/core";
import { useDisclosure } from "@chakra-ui/core";
import { NavigationBar } from "../components";
import { Link } from "react-router-dom";
import { AppContext } from "../utils";

export function Home({ history }) {
  //   const loading = false;
  //   const accounts = ["Account 1", "Account 2", "Account 3"];
  let { accounts, loading } = useContext(AppContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  let acc = ["Account-1", "Account-2", "Acccount-3", "Account-4"];

  function handleChange() {}
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

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Market</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} ml={7}>
            <FormControl width="60%" mb={1} mx={3} isRequired>
              <FormLabel htmlFor="Account">From Account</FormLabel>
              <Select>
                {acc.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl width="50%" mb={1} mx={3} isRequired>
              <FormLabel htmlFor="market">Market</FormLabel>
              <Select value id="market" onChange>
              {acc.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              </Select>
            </FormControl>
            <FormControl width="50%" mb={1} mx={3} isRequired>
              <FormLabel htmlFor="to_account">To Account</FormLabel>
              <Select value id="to_account" onChange>
              {acc.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variantColor="blue" mr={3}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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

function onOpenModal() {}

function ManualClose() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}></ModalBody>

          <ModalFooter>
            <Button variantColor="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

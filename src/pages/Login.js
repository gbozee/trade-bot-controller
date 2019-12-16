import React from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Heading,
  Button
} from "@chakra-ui/core";
import { NavigationBar } from "../components";
export function Login({}) {
  return (
    <Box className="App">
      <NavigationBar title="Bee's Cryptobot | Login" />
      <Flex
        flexDirection="column"
        width={["100%", "80%", "50%"]}
        margin="0 auto"
      >
        <Heading alignSelf="center" py={"1em"}>
          Login
        </Heading>
        <FormControl mb={"1em"} isInvalid={true}>
          <FormLabel htmlFor="email">Email address</FormLabel>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            aria-describedby="email-helper-text"
          />
          <FormErrorMessage>Missing email</FormErrorMessage>
        </FormControl>
        <FormControl mb={"1em"} isInvalid={true}>
          <FormLabel htmlFor="email">Password</FormLabel>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            aria-describedby="password-helper-text"
          />
          <FormErrorMessage>Missing password</FormErrorMessage>
        </FormControl>
        <Button variantColor="blue">Button</Button>
      </Flex>
    </Box>
  );
}

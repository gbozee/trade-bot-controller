import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  ThemeProvider,
  CSSReset,
  PseudoBox,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stat,
  StatLabel,
  StatHelpText,
  StatArrow,
  StatNumber,
  Text,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure
} from "@chakra-ui/core";

const MarketWithStat = ({ children, selected = false, onSelect }) => {
  return (
    <PseudoBox
      flexBasis={["40%", "40%", "30%", "20%"]}
      my={[3, 1, 3]}
      textAlign="center"
      mx={3}
      py={1}
      tabIndex={0}
      height={["6em"]}
      borderWidth="3px"
      onClick={onSelect}
      _hover={{ cursor: "pointer" }}
      _focus={{ boxShadow: "outline" }}
      style={{ backgroundColor: selected ? "teal" : "inherit" }}
    >
      <Stat>
        <StatLabel>Sent</StatLabel>
        <StatNumber>{children}</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          23.36%
        </StatHelpText>
      </Stat>
    </PseudoBox>
  );
};

const SidebarDrawer = ({ isOpen, onClose, btnRef }) => {
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Create your account</DrawerHeader>

        <DrawerBody>
          <Input placeholder="Type here..." />
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button color="blue">Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
const NavigationBar = ({ onClick, isOpen, onOpen, onClose, btnRef }) => {
  return (
    <Box
      bg="tomato"
      alignItems="center"
      justifyContent="space-between"
      w="100%"
      p={4}
      color="white"
      display="flex"
    >
      <Text>Main Account Markets</Text>
      <MenuComponent
        defaultText="Filter"
        options={["BTC Markets", "USDT Markets", "ETH Markets", "BNB Markets"]}
        buttonProps={{ variantColor: "teal" }}
      />
      <SidebarDrawer {...{ isOpen, onClose, btnRef }} />
    </Box>
  );
};
const MenuComponent = ({
  options = [],
  defaultText = "Menu",
  buttonProps = {}
}) => {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon="chevron-down" {...buttonProps}>
        {defaultText}
      </MenuButton>
      <MenuList>
        {options.map(param => (
          <MenuItem>{param}</MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
function ConfigurationComponent({ params }) {
  return (
    <Flex direction="column">
      <Flex mt={5} mx={3}>
        <MenuComponent defaultText="Configurations" options={params} />
      </Flex>
      <Flex
        justifyContent={["space-between", "space-between", "flex-start"]}
        flexGrow={0.3}
        flexDirection={["column", "row"]}
        // mx={3}
        my={5}
      >
        <FormControl mx={3} isRequired>
          <FormLabel htmlFor="fname">Multiplier</FormLabel>
          <Input id="fname" placeholder="First name" />
        </FormControl>
        <FormControl mx={3} isRequired>
          <FormLabel htmlFor="fname">Spread Multiplier</FormLabel>
          <Input id="fname" placeholder="First name" />
        </FormControl>
        <FormControl mx={3} isRequired>
          <FormLabel htmlFor="fname">Buy Amount</FormLabel>
          <Input id="fname" placeholder="First name" />
        </FormControl>
      </Flex>
    </Flex>
  );
}
function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  let markets = [
    "BTC/USDT",
    "ETH/USDT",
    "XRP/USDT",
    "XMR/USDT",
    "ONT/USDT",
    "ETH/BTC",
    "BNB/USDT"
  ];
  let [selectedMarkets, setSelectedMarkets] = useState([]);

  function addOrRemoveMarkets(_market) {
    if (selectedMarkets.includes(_market)) {
      setSelectedMarkets(selectedMarkets.filter(x => x !== _market));
    } else {
      setSelectedMarkets([...selectedMarkets, _market]);
    }
  }
  let params = ["multiplier", "spread multiplier", "buy amount", ""];
  return (
    <Box className="App">
      <NavigationBar {...{ isOpen, onOpen, onClose, btnRef }} />
      <Flex
        flexDirection="column"
        justifyContent={["space-between", "inherit"]}
        mx={3}
        // width={['100%',"100%","80%"]}
        minHeight="90vh"
      >
        <Box pt={5}>
          <Stack
            isInline
            spacing={8}
            justifyContent={["space-between", "space-between", "flex-start"]}
            flexWrap="wrap"
            maxHeight="400px"
            overflowY="scroll"
          >
            {markets.map(market => {
              return (
                <MarketWithStat
                  onSelect={() => {
                    addOrRemoveMarkets(market);
                  }}
                  selected={selectedMarkets.includes(market)}
                >
                  {market}
                </MarketWithStat>
              );
            })}
          </Stack>
        </Box>
        {selectedMarkets.length > 1 ? (
          <ConfigurationComponent params={params} />
        ) : (
          <ControlButton
            onEdit={onOpen}
            onAdd={onOpen}
            btnRef={btnRef}
            edit={selectedMarkets.length === 1}
          />
        )}
        <Button
          position={["relative", "fixed"]}
          style={{ bottom: "2em" }}
          mt={["2em", "inherit"]}
          variantColor="blue"
          width="50%"
          mb={3}
        >
          Submit
        </Button>
      </Flex>
    </Box>
  );
}

const ControlButton = ({ edit, onEdit, onAdd, btnRef }) => {
  return (
    <IconButton
      size="lg"
      variantColor="pink"
      position="fixed"
      ref={btnRef}
      style={{
        right: "2em",
        bottom: "2em"
      }}
      onClick={edit ? onEdit : onAdd}
      icon={edit ? "edit" : "add"}
      borderRadius="50%"
    />
  );
};

const rootElement = document.getElementById("root");
//Documentation for the styling library is located at https://chakra-ui.com/button
ReactDOM.render(
  <ThemeProvider>
    <CSSReset />
    <App />
  </ThemeProvider>,
  rootElement
);

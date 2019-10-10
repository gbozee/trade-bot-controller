import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import {
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
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Spinner
} from "@chakra-ui/core";
import { AppContext, useWebSockets } from "../utils";
import { NavigationBar } from "../components";

const MarketWithStat = ({ children, selected = false, onSelect, market }) => {
  const { prices, percent } = useWebSockets(
    `${market.coin.toUpperCase()}${market.buy_market.toUpperCase()}`,
    market.price_places
  );
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
        <StatLabel>
          {prices === "Loading" ? "Loading Price" : "$" + prices}
        </StatLabel>
        <StatNumber>{children}</StatNumber>
        {percent ? (
          <StatHelpText>
            <StatArrow type={percent > 0 ? "increase" : "decrease"} />
            {percent}%
          </StatHelpText>
        ) : null}
      </Stat>
    </PseudoBox>
  );
};

const SidebarDrawer = ({ isOpen, onClose, btnRef, market }) => {
  const { configs, getMarketConfig } = useContext(AppContext);

  console.log(market);

  let [config, setConfig] = useState({});
  let [multiplier, setMutiplier] = useState();
  let [spreadMultiplier, setSpreadMultiplier] = useState();
  let [amount, setAmount] = useState("78");

  const handleConfigMultiplier = event => {
    setMutiplier(event.target.value);
  };

  function setState(key, value) {
    let newConfig = { ...config, [key]: value };
    setConfig(newConfig);
  }
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent maxHeight="100vh" overflowY="scroll">
        <DrawerCloseButton />
        <DrawerHeader>
          {!market ? `Create new market` : `Edit ${market} market`}
        </DrawerHeader>

        <DrawerBody>
          <Flex
            justifyContent={["space-between", "space-between", "flex-start"]}
            flexGrow={0.3}
            flexDirection={["column"]}
            // mx={3}
            my={5}
          >
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Multiplier</FormLabel>
              <Input
                id="fname"
                placeholder="Multiplier"
                value={multiplier}
                onChange={handleConfigMultiplier}
              />
            </FormControl>

            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Buy Amount</FormLabel>
              <Input id="fname" placeholder="Buy Amount" value={amount} />
            </FormControl>

            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Spread Multiplier</FormLabel>
              <Input
                id="fname"
                placeholder="Spread Multiplier"
                value={spreadMultiplier}
              />
            </FormControl>

            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Equal </FormLabel>
              <Input id="fname" placeholder="Equal" value={"quantity"} />
            </FormControl>

            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Coin </FormLabel>
              <Input id="fname" placeholder="Coin" value={"LTC"} />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Buy Market </FormLabel>
              <Input id="fname" placeholder="Buy Market" value={"USDC"} />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Sell Market </FormLabel>
              <Input id="fname" placeholder="Sell Market" value={"USDC"} />
            </FormControl>

            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Sell Amount </FormLabel>
              <Input id="fname" placeholder="Sell Amount" value={"10.1"} />
            </FormControl>

            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Budget </FormLabel>
              <Input id="fname" placeholder="Budget" value={"65.25234943"} />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Purchased Price </FormLabel>
              <Input id="fname" placeholder="Purchased Price" value={"100"} />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Trades </FormLabel>
              <Input id="fname" placeholder="Trades" value={"10"} />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Expected rise point </FormLabel>
              <Input
                id="fname"
                placeholder="Expected rise point"
                value={"150"}
              />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Max trade count </FormLabel>
              <Input id="fname" placeholder="Max trade count" value={"2"} />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Montly Profit </FormLabel>
              <Input id="fname" placeholder="Montly Profit" value={"600"} />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Marubozu length </FormLabel>
              <Input id="fname" placeholder="Marubozu length" value={"300"} />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Label </FormLabel>
              <Input id="fname" placeholder="Label" value={"LTC"} />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Decimal places </FormLabel>
              <Input id="fname" placeholder="Decimal places" value={"%.5f"} />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Price places </FormLabel>
              <Input id="fname" placeholder="Price places" value={"%.2f"} />
            </FormControl>

            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Spread </FormLabel>
              <Input id="fname" placeholder="Spread" value={"0.43"} />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">One way </FormLabel>
              <Input id="fname" placeholder="One way" value={"True"} />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Pause </FormLabel>
              <Input id="fname" placeholder="Pause" value={"False"} />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Invest Value </FormLabel>
              <Input id="fname" placeholder="Invest Value" value={"None"} />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Margin support </FormLabel>
              <Input id="fname" placeholder="Margin support" value={"True"} />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Margin market </FormLabel>
              <Input id="fname" placeholder="Trades" value={"USDT"} />
            </FormControl>
          </Flex>
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
const MenuComponent = ({
  options = [],
  defaultText = "Menu",
  buttonProps = {},
  menuProps = {},
  onMenuItemClick = () => {}
}) => {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon="chevron-down" {...buttonProps}>
        {defaultText}
      </MenuButton>
      <MenuList {...menuProps}>
        {options.map(param => (
          <MenuItem onClick={() => onMenuItemClick(param)}>{param}</MenuItem>
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
          <Input
            id="fname"
            // value={config.multiplier}
            // onChange={e => setState("multiplier", e.target.value)}
            placeholder="Multiplier"
          />
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
export function Market({ match }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const { markets, loading, getMarket } = useContext(AppContext);

  let [selectedMarkets, setSelectedMarkets] = useState([]);
  let [newEditItem, setNewEditItem] = useState();

  function addOrRemoveMarkets(_market) {
    if (selectedMarkets.includes(_market)) {
      setSelectedMarkets(selectedMarkets.filter(x => x !== _market));
      setNewEditItem(undefined);
    } else {
      setSelectedMarkets([...selectedMarkets, _market]);
      setNewEditItem(_market);
    }
  }
  useEffect(() => {
    getMarket(match.params.account);
  }, []);
  let params = ["multiplier", "spread multiplier", "buy amount", ""];
  return (
    <Box className="App">
      <NavigationBar title="Main Account Markets">
        <MenuComponent
          defaultText="Filter"
          options={[
            "BTC Markets",
            "USDT Markets",
            "ETH Markets",
            "BNB Markets"
          ]}
          menuProps={{ background: "teal" }}
          buttonProps={{ variantColor: "teal", variant: "solid" }}
        />
        <SidebarDrawer {...{ isOpen, onClose, btnRef, market: newEditItem }} />
      </NavigationBar>
      {loading ? (
        <Box display="flex" justifyContent="center" height="20em">
          <Spinner alignSelf="center" />
        </Box>
      ) : (
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
                      addOrRemoveMarkets(market.market_label());
                    }}
                    market={market}
                    selected={selectedMarkets.includes(market.market_label())}
                  >
                    {market.market_label()}
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
      )}
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

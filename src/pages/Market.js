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
  RadioGroup,
  Radio,
  Spinner
} from "@chakra-ui/core";
import { AppContext } from "../utils";
import { NavigationBar } from "../components";

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

const SidebarDrawer = ({ isOpen, onClose, btnRef, market }) => {
  const { configs, getMarketConfig } = useContext(AppContext);

  let [config, setConfig] = useState({
    multiplier: " 56",
    spread_multiplier: ""
  });

  console.log(config);

  const handleChange = input => e => {
    setConfig({ ...config, [input]: e.target.value });
  };

  function setState(key, value) {
    // let newConfig = { ...config, [key]: value };
    let newConfig = { [key]: value };

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
      <DrawerContent overflow="scroll">
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
                name="multiplier"
                id="fname"
                placeholder="Multiplier"
                onChange={handleChange("multiplier")}
              />
            </FormControl>

            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Buy Amount</FormLabel>
              <Input
                id="fname"
                name="buy_amount"
                placeholder="Buy Amount"
                onChange={handleChange("buy_amount")}
              />
            </FormControl>

            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Spread Multiplier</FormLabel>
              <Input
                id="fname"
                name="spread_multiplier"
                placeholder="Spread Multiplier"
                onChange={handleChange("spread_multiplier")}
              />
            </FormControl>

            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Equal </FormLabel>
              <Input
                id="fname"
                name="equal"
                placeholder="Equal"
                onChange={handleChange("equal")}
              />
            </FormControl>

            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Coin </FormLabel>
              <Input
                id="fname"
                name="coin"
                placeholder="Coin"
                onChange={handleChange("coin")}
              />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Buy Market </FormLabel>
              <Input
                id="fname"
                name="buy_market"
                placeholder="Buy Market"
                value={"USDC"}
                onChange={handleChange("buy_market")}
              />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Sell Market </FormLabel>
              <Input
                id="fname"
                name="sell_market"
                placeholder="Sell Market"
                value={"USDC"}
                onChange={handleChange("sell_market")}
              />
            </FormControl>

            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Sell Amount </FormLabel>
              <Input
                id="fname"
                name="sell_amount"
                placeholder="Sell Amount"
                value={"10.1"}
                onChange={handleChange("sell_amount")}
              />
            </FormControl>

            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Budget </FormLabel>
              <Input
                id="fname"
                name="budget"
                placeholder="Budget"
                value={"65.25234943"}
                onChange={handleChange("budget")}
              />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Purchased Price </FormLabel>
              <Input
                id="fname"
                name="purchased_price"
                placeholder="Purchased Price"
                value={"100"}
                onChange={handleChange("purchased_price")}
              />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Trades </FormLabel>
              <Input
                id="fname"
                name="trades"
                placeholder="Trades"
                value={"10"}
                onChange={handleChange("trades")}
              />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Expected rise point </FormLabel>
              <Input
                id="fname"
                name="expected_rise_point"
                placeholder="Expected rise point"
                value={"150"}
                onChange={handleChange("expected_rise_point")}
              />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Max trade count </FormLabel>
              <Input
                id="fname"
                name="max_trade_coount"
                placeholder="Max trade count"
                value={"2"}
                onChange={handleChange("max_trade_coount")}
              />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Montly Profit </FormLabel>
              <Input
                id="fname"
                name="montly_profit"
                placeholder="Montly Profit"
                value={"600"}
                onChange={handleChange("montly_profit")}
              />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Marubozu length </FormLabel>
              <Input
                id="fname"
                name="marubozu_lenght"
                placeholder="Marubozu length"
                value={"300"}
                onChange={handleChange("marubozu_lenght")}
              />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Label </FormLabel>
              <Input
                id="fname"
                name="label"
                placeholder="Label"
                value={"LTC"}
                onChange={handleChange("label")}
              />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Decimal places </FormLabel>
              <Input
                id="fname"
                name="decimal_places"
                placeholder="Decimal places"
                value={"%.5f"}
                onChange={handleChange("decimal_places")}
              />
            </FormControl>
            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Price places </FormLabel>
              <Input
                id="fname"
                name="price_places"
                placeholder="Price places"
                value={"%.2f"}
                onChange={handleChange("price_places")}
              />
            </FormControl>

            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Spread </FormLabel>
              <Input
                id="fname"
                nam="spread"
                placeholder="Spread"
                value={"0.43"}
                onChange={handleChange("spread")}
              />
            </FormControl>

            <FormControl as="fieldset" mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">One way </FormLabel>
              <RadioGroup
                defaultValue="True"
                display="inline-flex"
                onChange={handleChange("one_way")}
              >
                <Radio mr={1} value="True">
                  True
                </Radio>
                <Radio value="False">False</Radio>
              </RadioGroup>
            </FormControl>

            <FormControl as="fieldset" mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Pause </FormLabel>
              <RadioGroup
                defaultValue="False"
                display="inline-flex"
                onChange={handleChange("pause")}
              >
                <Radio mr={1} value="True">
                  True
                </Radio>
                <Radio value="False">False</Radio>
              </RadioGroup>
            </FormControl>

            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Invest Value </FormLabel>
              <Input
                id="fname"
                name="invest_value"
                placeholder="Invest Value"
                value={"None"}
                onChange={handleChange("invest_value")}
              />
            </FormControl>

            <FormControl as="fieldset" mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Margin support </FormLabel>
              <RadioGroup
                defaultValue="True"
                display="inline-flex"
                onChange={handleChange("margin_support")}
              >
                <Radio mr={1} value="True">
                  True
                </Radio>
                <Radio value="False">False</Radio>
              </RadioGroup>
            </FormControl>

            <FormControl mb={1} mx={3} isRequired>
              <FormLabel htmlFor="fname">Margin market </FormLabel>
              <Input
                id="fname"
                name="margin_market"
                placeholder="Margin market"
                value={"USDT"}
                onChange={handleChange("margin_market")}
              />
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
          buttonProps={{ variantColor: "teal" }}
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

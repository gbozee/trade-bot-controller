import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Spinner,
  Checkbox,
  useToast,
  Grid
} from "@chakra-ui/core";
import { AppContext } from "../../utils";
import {
  NavigationBar,
  SubNavigationBar,
  ControlButton
} from "../../components";
import { FormComponent, useFormState } from "./FormComponent";
import { MarketWithStat } from "./Components";
import { Link } from "react-router-dom";

const SidebarDrawer = ({
  isOpen,
  onClose,
  btnRef,
  market,
  marketInfo = {},
  hiddenFields = [],
  formFields,
  onSubmit
}) => {
  const { onSaveHandler, ...formParams } = useFormState(marketInfo, onSubmit);
  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent maxHeight="100vh" overflowY="scroll">
        {/* <DrawerCloseButton /> */}
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
            <FormComponent
              {...formParams}
              {...{ formFields, hiddenFields, market }}
              // getData
            />
          </Flex>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button color="blue" onClick={onSaveHandler}>
            Save
          </Button>
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
  renderItem = x => x,
  onMenuItemClick = () => {},
  withCheckbox = false,
  isSelected = () => false
}) => {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon="chevron-down" {...buttonProps}>
        {defaultText}
      </MenuButton>
      <MenuList {...menuProps}>
        {options.map((param, index) => {
          let child = (
            <MenuItem key={index} onClick={() => onMenuItemClick(param)}>
              {renderItem(param)}
            </MenuItem>
          );
          if (withCheckbox) {
            return (
              <Checkbox key={index} defaultIsChecked={isSelected(param)} ml={3}>
                {child}
              </Checkbox>
            );
          }
          return child;
        })}
      </MenuList>
    </Menu>
  );
};
function ConfigurationComponent({ params, onSubmit }) {
  let [selectedFields, setSelectedFields] = useState([]);
  const {
    displayText,
    setDisplayText,
    onSaveHandler,
    ...formParams
  } = useFormState(undefined, onSubmit, false);

  return (
    <>
      <Flex direction="column">
        <Flex mt={5} mx={3}>
          <MenuComponent
            withCheckbox
            menuProps={{ display: "flex", flexDirection: "column" }}
            defaultText="Configurations"
            onMenuItemClick={item => {
              setDisplayText(false);
              if (selectedFields.includes(item.value)) {
                setSelectedFields(selectedFields.filter(x => x !== item.value));
              } else {
                setSelectedFields([...selectedFields, item.value]);
              }
            }}
            options={params.map(x => ({ name: x.label, value: x.name }))}
            renderItem={x => x.name}
            isSelected={item => {
              return selectedFields.includes(item.value);
            }}
          />
        </Flex>
        <Flex
          justifyContent={["space-between", "space-between", "flex-start"]}
          flexGrow={0.3}
          flexDirection={["column", "row"]}
          // mx={3}
          flexWrap="wrap"
          my={5}
        >
          <FormComponent
            componentProps={{ mb: 4 }}
            formFields={params.filter(x => selectedFields.includes(x.name))}
            {...formParams}
            fieldsToUnhide={["pause", "profit_value"]}
          />
        </Flex>
        {displayText ? (
          <Box
            bg="tomato"
            w="50%"
            p={4}
            color="teal.900"
            ml={40}
            textAlign="center"
            fontWeight="semibold"
          >
            Set values from the configurations
          </Box>
        ) : null}

        <Button
          position={["relative", "fixed"]}
          style={{ bottom: "2em" }}
          mt={["2em", "inherit"]}
          variantColor="blue"
          width="50%"
          onClick={onSaveHandler}
          mb={3}
        >
          Submit
        </Button>
      </Flex>
    </>
  );
}
function GridLayout({ items, onSelect, selectedMarkets = [] }) {
  return (
    <>
      <Grid
        pt={5}
        templateColumns={["repeat(2, 1fr)", "repeat(3,1fr)", "repeat(4,1fr)"]}
        gap={[1, 2, 3]}
        maxHeight="400px"
        overflowY="scroll"
      >
        {items.map(market => {
          return (
            <MarketWithStat
              key={market.market_label()}
              onSelect={() => {
                onSelect(market.market_label());
              }}
              market={market}
              selected={selectedMarkets.includes(market.market_label())}
            >
              {market.market_label()}
            </MarketWithStat>
          );
        })}
      </Grid>
      {/* <Box pt={5}>
        <Stack
          isInline
          spacing={8}
          justifyContent={["space-between", "space-between", "flex-start"]}
          flexWrap="wrap"
          maxHeight="400px"
          overflowY="scroll"
        >
          {items.map(market => {
            return (
              <MarketWithStat
                key={market.market_label()}
                onSelect={() => {
                  onSelect(market.market_label());
                }}
                market={market}
                selected={selectedMarkets.includes(market.market_label())}
              >
                {market.market_label()}
              </MarketWithStat>
            );
          })}
        </Stack>
      </Box> */}
    </>
  );
}
export function Market({ match, history }) {
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const {
    loading,
    getMarket,
    hiddenFields,
    getFormFields,
    getFormResult,
    bulkUpdateMarkets
  } = useContext(AppContext);
  const [markets, setMarkets] = useState([]);
  let [selectedMarkets, setSelectedMarkets] = useState([]);
  let [newEditItem, setNewEditItem] = useState();
  let [filteredItem, setFilteredItem] = useState(" ");

  function getFilterItem(filteredItem) {
    if (filteredItem === " ") {
      return markets;
    } else {
      let filteredmarket = markets.filter(x => x.buy_market === filteredItem);
      return filteredmarket;
    }
  }

  function addOrRemoveMarkets(_market) {
    if (selectedMarkets.includes(_market)) {
      let filtered = selectedMarkets.filter(x => x !== _market);
      setSelectedMarkets(filtered);
      if (filtered.length === 1) {
        setNewEditItem(filtered[0]);
      } else {
        setNewEditItem(undefined);
      }
    } else {
      setSelectedMarkets([...selectedMarkets, _market]);
      setNewEditItem(_market);
    }
  }
  useEffect(() => {
    // console.log(isOpen);
  });
  useEffect(() => {
    getMarkets();
  }, []);
  function getMarkets() {
    getMarket(match.params.account).then(mk => {
      setMarkets(mk);
    });
  }
  function displayToast(description) {
    toast({
      title: "Markets saved",
      description,
      status: "success",
      duration: 3000,
      isClosable: true
    });
  }
  function onSubmit(config) {
    console.log(config);
    if (selectedMarkets.length > 0) {
      let foundMarkets = markets.map(x => {
        if (selectedMarkets.includes(x.market_label())) {
          return { ...x, ...config };
        }
        return x;
      });
      return bulkUpdateMarkets(foundMarkets, match.params.account).then(() => {
        setMarkets(foundMarkets);
        onClose();
        displayToast("The markets have been saved");
      });
    } else {
      /**
       * return new Promise((resovle,reject)=>reject(["coin",'market']))
       */
      return getFormResult(config, match.params.account).then(fetchedMarket => {
        setMarkets([...markets, fetchedMarket]);
        displayToast(`${fetchedMarket.market_label()} has been saved`);
        onClose();
        return {};
      });
    }
  }
  let routes = [
    { name: "Home", path: "/" },
    {
      name: match.params.account,
      path: `/${match.params.account}/markets`,
      current: true
    }
  ];
  return (
    <Box className="App">
      <NavigationBar title="Main Account Markets">
        <MenuComponent
          defaultText="Filter"
          options={["All", "BTC", "USDT", "ETH ", "BNB"]}
          value={filteredItem}
          onMenuItemClick={x => {
            setFilteredItem(x);
          }}
          menuProps={{ background: "teal" }}
          buttonProps={{ variantColor: "teal", variant: "solid" }}
        />
        {isOpen && (
          <SidebarDrawer
            {...{
              isOpen,
              onClose,
              btnRef,
              hiddenFields,
              market: newEditItem,
              marketInfo: markets.find(x => x.market_label() === newEditItem),
              formFields: getFormFields(),
              onSubmit
            }}
          />
        )}
      </NavigationBar>
      <Box px={6} pt={3}>
        <SubNavigationBar routes={routes} />
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" height="20em">
          <Spinner alignSelf="center" />
        </Box>
      ) : (
        <Flex
          flexDirection="column"
          justifyContent={["space-between", "inherit"]}
          mx={3}
          minHeight="90vh"
        >
          {/*Grid layout for markets */}
          <GridLayout
            items={getFilterItem(filteredItem)}
            onSelect={addOrRemoveMarkets}
            selectedMarkets={selectedMarkets}
          />

          {selectedMarkets.length > 1 ? (
            <ConfigurationComponent
              params={getFormFields("bulk")}
              onSubmit={onSubmit}
            />
          ) : (
            <>
              <ControlButton
                btnRef={btnRef}
                onClick={selectedMarkets.length === 1 ? onOpen : onOpen}
                icon={selectedMarkets.length === 1 ? "edit" : "add"}
                variantColor="pink"
                style={{
                  right: "2em",
                  bottom: "2em"
                }}
              />
              {selectedMarkets.length === 1 && (
                <ControlButton
                  as={Link}
                  to={{
                    pathname: `/markets/${selectedMarkets[0]
                      .toLowerCase()
                      .replace("/", "")}`,
                    state: { account_id: match.params.account }
                  }}
                  btnRef={btnRef}
                  icon={"calendar"}
                  variantColor="teal"
                  style={{
                    right: "6em",
                    bottom: "2em"
                  }}
                />
              )}
            </>
          )}
        </Flex>
      )}
    </Box>
  );
}

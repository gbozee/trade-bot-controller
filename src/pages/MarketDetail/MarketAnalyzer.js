import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Input,
  FormControl,
  FormLabel,
  Code,
  Select,
  Radio,
  RadioGroup,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Button,
  Spinner,
  Flex,
  useToast
} from "@chakra-ui/core";
import { AppContext } from "../../utils";
import { useDisclosure } from "@chakra-ui/core";
import { useAccountMarket, useStorage } from "../../hooks";
import { XModal } from "../../components";
import { supported_markets } from "../../data/prod";

export function MarketAnalyzer({
  textBlob,
  analyzeLoader,
  onsubmit,
  onCreateMarket,
  account,
  accounts,
  defaultConfig = {},
  symbol,
  cachedAlternateMarket,
  onEditSave
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let { config, handleChange, updateRange, onSaveForm } = useDetailForm({
    defaultConfig,
    onsubmit,
    onCreateMarket
  });
  console.log(config);
  function getValues(x) {
    let fields = [
      "coin",
      "buy_market",
      "sell_market",
      "budget",
      "buy_amount",
      "sell_amount",
      "multiplier",
      "max_trade_count",
      "take_profits",
      "margin_support",
      "margin_market",
      "buy_amount",
      "sell_amount",
      "price_places",
      "decimal_places"
    ];
    let resultValue = {
      take_profits: true,
      // budget: 200,
      // max_trade_count: 1,
      margin_support: false,
      use_new: true,
      one_way: true,
      profit_value: textBlob.json.buy_amount
    };
    fields.forEach(field => {
      if (Object.keys(x).includes(field)) {
        resultValue[field] = x[field];
      } else {
        if (["buy_market", "sell_market"].includes(field)) {
          resultValue[field] = x.market.toLowerCase();
        }
        if (
          [
            "buy_amount",
            "sell_amount",
            "price_places",
            "decimal_places"
          ].includes(field)
        ) {
          resultValue[field] = textBlob.json[field];
        }
      }
    });
    if (resultValue.budget) {
      resultValue.budget = parseFloat(resultValue.budget);
    }
    return resultValue;
  }
  function onSave(accountSelected) {
    let values = getValues(config);
    onCreateMarket(values, accountSelected)
      .then(() => {
        onClose();
        //show toast
        //close modal
      })
      .catch(error => {
        debugger;
      });
  }

  return (
    <Box display="flex" flex={0.95} flexDirection="column">
      <MarketDetailsForm
        {...{
          handleChange,
          cachedAlternateMarket,
          updateRange,
          onSaveForm,
          textBlob,
          onOpen,
          config,
          account,
          onEditSave
        }}
        defaultMarket={defaultConfig.coin || symbol}
      >
        <AddNewMarketModal
          {...{ isOpen, onClose, onSave, account, accounts }}
        />
      </MarketDetailsForm>

      {analyzeLoader ? (
        <Box textAlign="center" mt={20}>
          <Spinner alignSelf="center" textAlign="center" />
        </Box>
      ) : (
        textBlob.text && (
          <Code
            width={"100%"}
            maxHeight={"500px"}
            overflowY="scroll"
            pl={2}
            py={4}
            dangerouslySetInnerHTML={{ __html: textBlob.text }}
          />
        )
      )}
    </Box>
  );
}
function useSupportedMarkets(coin, cachedAlternateMarket) {
  let [loading, setLoading] = useState(false);
  // let result = extractCoinFromSymbol(coin);
  let [supported_markets, setSupported_markets] = useState([]);

  useEffect(() => {
    if (supported_markets.length === 0) {
      setLoading(true);
      cachedAlternateMarket(coin, () => {
        setLoading(true);
      }).then(result => {
        let rr = result.map(x => x.toLowerCase().replace(coin, ""));
        setSupported_markets(rr);
        setLoading(false);
      });
    }
  }, [coin]);

  return [supported_markets, loading];
}
function useDetailForm({ defaultConfig, onsubmit }) {
  let localDefaultconfig = {
    budget: 500,
    max_trade_count: 1,
    pause: false,
    take_profits: false,
    market_condition: "bull"
  };
  let [config, setConfig] = useState({
    ...localDefaultconfig,
    ...defaultConfig
  });
  useEffect(() => {
    let newConfig = defaultConfig;
    if (newConfig.market) {
      newConfig.buy_market = newConfig.market;
    }
    setConfig({ ...config, ...newConfig });
  }, [defaultConfig.coin]);

  const updateRange = input => x => {
    let newConfig = { ...config, [input]: x };
    setConfig(newConfig);
  };
  const handleChange = (input, kind) => e => {
    let value = e.target.value;
    if (kind === "number") {
      value = parseFloat(value);
    }
    if (e.target.type === "radio") {
      value = str2bool(value);
    }
    let newConfig = { ...config, [input]: value };
    setConfig(newConfig);
  };
  function onSaveHandler(event) {
    return onsubmit(config);
  }

  function str2bool(value) {
    if (value && typeof value === "string") {
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
    }
    return value;
  }

  // function displayToast(description) {
  //   toast({
  //     title: "Markets transferred",
  //     description,
  //     status: "success",
  //     duration: 5000,
  //     isClosable: true
  //   });
  // }

  return {
    config,
    handleChange,
    updateRange,
    onSaveForm: onSaveHandler
  };
}

export function MarketDetailsForm({
  config,
  textBlob,
  defaultMarket,
  updateRange,
  children,
  onSaveForm,
  onOpen,
  account,
  cachedAlternateMarket,
  handleChange,
  onEditSave
}) {
  const [supported_markets, loading] = useSupportedMarkets(
    defaultMarket,
    cachedAlternateMarket
  );

  function editFormHandler(e) {
    onEditSave(config);
  }

  // function displayToast(description) {
  //   toast({
  //     title: "Markets transferred",
  //     description,
  //     status: "success",
  //     duration: 5000,
  //     isClosable: true
  //   });
  // }

  return (
    <Box display="flex" flex={0.95} flexDirection="column">
      <Box flexWrap="wrap" display="flex">
        {supported_markets.every(x => x.length > 5) ? (
          <FormControl mb={1} width="42%" mx={3} isRequired>
            <FormLabel htmlFor="market">Market</FormLabel>
            <Input
              isDisabled
              value={config.buy_market}
              onChange={handleChange("market")}
              name="market"
            />
          </FormControl>
        ) : (
          <FormControl width="42%" mb={1} mx={3} isRequired>
            <FormLabel htmlFor="market">Market</FormLabel>
            {loading ? (
              <Box ml={2}>
                <Spinner alignSelf="center" textAlign="center" />
              </Box>
            ) : (
              <Select
                value={config.market}
                id="market"
                onChange={handleChange("market")}
              >
                (<option>Select Market</option>
                {supported_markets.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            )}
          </FormControl>
        )}

        <FormControl mb={1} width="42%" mx={3} isRequired>
          <FormLabel htmlFor="buy_amount">Buy Amount</FormLabel>
          <Input
            value={config.buy_amount}
            onChange={handleChange("buy_amount", "number")}
            type="number"
            name="buy_amount"
          />
        </FormControl>
        <FormControl width="42%" mb={1} mx={3} isRequired display="none">
          <FormLabel htmlFor="interval">Interval</FormLabel>
          <Select>
            <option>1d</option>
          </Select>
        </FormControl>
        <FormControl mb={1} width="42%" mx={3} isRequired>
          <FormLabel htmlFor="budget">Budget</FormLabel>
          <Input
            value={config.budget}
            onChange={handleChange("budget", "number")}
            type="number"
          />
        </FormControl>
        <FormControl width="42%" mb={1} mx={3} isRequired>
          <FormLabel htmlFor="max_trade_count">Max Trade Count</FormLabel>
          <Select
            value={config.max_trade_count}
            id="market"
            onChange={handleChange("max_trade_count", "number")}
            type="number"
          >
            {[1, 2, 3, 4, 5].map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl mb={1} width="42%" mx={3} isRequired display="none">
          <FormLabel htmlFor="profit">Profit</FormLabel>
          <Input
            value={config.profit}
            onChange={handleChange("profit")}
            type="number"
          />
        </FormControl>
        <FormControl width="30%" mb={1} mx={3} isRequired>
          <FormLabel htmlFor="multiplier">Multiplier</FormLabel>
          <Slider
            defaultValue={config.multiplier}
            onChange={updateRange("multiplier")}
            max={10}
          >
            <SliderTrack />
            <SliderFilledTrack />
            <SliderThumb size={6}>
              <Box color="tomato" as={Text} children={config.multiplier} />
            </SliderThumb>
          </Slider>
        </FormControl>
        {/**
        <FormControl
          width="50%"
          mb={1}
          mx={3}
          isRequired
          display={account ? "inherit" : "none"}
        >
          <FormLabel htmlFor="market_condition">Market Condition</FormLabel>
          <Select
            value={config.market_condition}
            id="market"
            onChange={handleChange("market_condition")}
          >
            {["bull", "bear"].map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl
          width="100%"
          mb={1}
          mx={3}
          isRequired
          display={account ? "inherit" : "none"}
        >
          <FormLabel htmlFor="pause">Pause</FormLabel>
          <RadioGroup
            value={config.pause.toString() || null}
            onChange={handleChange("pause")}
            isInline
          >
            <Radio mr={1} value="true">
              True
            </Radio>
            <Radio value="false">False</Radio>
          </RadioGroup>
        </FormControl>

        <FormControl
          width="100%"
          mb={1}
          mx={3}
          isRequired
          display={account ? "inherit" : "none"}
        >
          <FormLabel htmlFor="take_profits">Take Profit</FormLabel>
          <RadioGroup
            value={config.take_profits.toString() || null}
            onChange={handleChange("take_profits")}
            isInline
          >
            <Radio mr={1} value="true">
              True
            </Radio>
            <Radio value="false">False</Radio>
          </RadioGroup>
            </FormControl> */}

        <Box w="100%">
          <Flex justifyContent="space-between">
            <Button onClick={onSaveForm}>Submit</Button>
            {textBlob.text ? (
              <Button
                variantColor="teal"
                onClick={account ? editFormHandler : onOpen}
              >
                {account ? "Save" : "Create"}
              </Button>
            ) : null}
          </Flex>
        </Box>
      </Box>
      {children}
    </Box>
  );
}

function AddNewMarketModal({ accounts, account, isOpen, onClose, onSave }) {
  const [accountSelected, setAccountSelected] = useState(account);

  function handleModalInput(e) {
    let value = e.target.value;
    setAccountSelected(value);
  }

  return (
    <XModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => onSave(accountSelected)}
      title="To Account"
      submitButtonProps={{ variantColor: "blue" }}
    >
      <Box pb={6} ml={7}>
        <FormControl mb={1} mx={3} isRequired>
          <FormLabel htmlFor="account"> Account</FormLabel>
          <Select
            value={accountSelected}
            id="account"
            onChange={handleModalInput}
          >
            <option>Select Account</option>
            {accounts.map(option => (
              <option key={option.slug} value={option.slug}>
                {option.title}
              </option>
            ))}
          </Select>
        </FormControl>
      </Box>
    </XModal>
  );
}

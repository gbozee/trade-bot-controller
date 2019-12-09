import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Input,
  FormControl,
  FormLabel,
  Code,
  Select,
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
  error,

 
}) 

{

  return (
    <Box display="flex" flex={0.95} flexDirection="column">
      <MarketDetailsForm
        symbol={symbol}
        onsubmit={onsubmit}
        onCreateMarket={onCreateMarket}
        textBlob={textBlob}
        account={account}
        accounts={accounts}
        defaultConfig={defaultConfig}
      />

      {analyzeLoader  && error ? (
        <Box textAlign="center" mt={20}>
          <Spinner alignSelf="center" textAlign="center" />
        </Box>
      ) : 
     (
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
function useSupportedMarkets(coin) {
  let { adapter } = useContext(AppContext);
  let [loading, setLoading] = useState(false);
  let { cachedAlternateMarket } = useStorage("all-markets", adapter);
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
export function MarketDetailsForm({
  onsubmit,
  onCreateMarket,
  textBlob,
  account,
  accounts = [],
  defaultConfig,
  symbol,
  edit
}) {
  let [config, setConfig] = useState(defaultConfig);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [supported_markets, loading] = useSupportedMarkets(
    defaultConfig.coin || symbol
  );

  const [accountSelected, setAccountSelected] = useState(account);
  useEffect(() => {
    setConfig({ ...config, ...defaultConfig });
  }, [defaultConfig.coin]);

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

   const handleChange = (input, kind) => e => {
    let value = e.target.value;
    if (kind === "number") {
      value = parseFloat(value);
    }
    let newConfig = { ...config, [input]: value };
    setConfig(newConfig);
  };
  const updateRange = input => x => {
    let newConfig = { ...config, [input]: x };
    setConfig(newConfig);
  };
  function onSaveHandler(event) {
    return onsubmit(config);
    
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

  function onSave(event) {
    onClose();
    let values = getValues(config);
    onCreateMarket(values, accountSelected).then(() => {
     
      //show toast
      //close modal
    });
  }

  function getValues(x) {
    let resultValue = {
      take_profits: true,
      // budget: 200,
      max_trade_count: 1,
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

  function handleModalInput(e) {
    let value = e.target.value;
    setAccountSelected(value);
  }

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
          <FormControl
            width="42%"
            mb={1}
            mx={3}
            isRequired
          >
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
        <FormControl mb={1} width="42%" mx={3} isRequired display="none">
          <FormLabel htmlFor="profit">Profit</FormLabel>
          <Input
            value={config.profit}
            onChange={handleChange("profit")}
            type="number"
          />
        </FormControl>
        <FormControl width="100%" mb={1} mx={3} isRequired>
          <FormLabel htmlFor="multiplier">Multiplier</FormLabel>
          <Slider
            defaultValue={config.multiplier}
            onChange={updateRange("multiplier")}
          >
            <SliderTrack />
            <SliderFilledTrack />
            <SliderThumb size={6}>
              <Box color="tomato" as={Text} children={config.multiplier} />
            </SliderThumb>
          </Slider>
        </FormControl>

        <Box w="100%">
          <Flex justifyContent="space-between">
            <Button onClick={onSaveHandler}>Submit</Button>
            {textBlob.text ? (
              <Button variantColor="teal" onClick={onOpen}>
                create
              </Button>
            ) : null}
          </Flex>
        </Box>
      </Box>

      <XModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSave}
        title="To Account"
        submitButtonProps={{ variantColor: "blue" }}
      >
        <Box pb={6} ml={7}>
          <FormControl mb={1} mx={3} isRequired>
            <FormLabel htmlFor="account"> Account</FormLabel>
            <Select value={accountSelected} id="account" onChange={handleModalInput}>
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
    </Box>
  );
}

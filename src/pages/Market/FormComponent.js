import React, { useEffect, useContext, useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  InputGroup,
  Button,
  InputRightElement,
  useToast
} from "@chakra-ui/core";
import { conditionalExpression } from "@babel/types";
import { isNull } from "util";

export const useFormState = (
  defaultconfig,
  onSubmit,
  is_new = true,
  bulk = true
) => {
  const toast = useToast();
  // Create a red toast that shows the error when the market already exists. Assignment 1.
  // const { getMarketConfig, supported_markets } = useContext(AppContext);
  let compulsoryFields = ["coin", "buy_amount", "buy_market", "spread"];
  let [displayText, setDisplayText] = useState(false);
  let [formErrors, setFormErrors] = useState({});

  // todays works starts from here

  let defaultInputValues = { max_trade_count: 1, market_condition: "bear" };

  let defaultformvalues = is_new || bulk ? defaultInputValues : {};
  let [config, setConfig] = useState(defaultformvalues);

  useEffect(() => {
    setConfig({ ...defaultformvalues, ...defaultconfig }); //
  }, []);

  function displayToast(description) {
    toast({
      title: "Markets saved",
      description,
      status: "success",
      duration: 5000,
      isClosable: true
    });
  }

  function validateForm(configuration) {
    let results = compulsoryFields.map(x => !!configuration[x]);
    let errors = {};
    compulsoryFields.forEach((x, i) => {
      let r = results[i];
      errors[x] = !r;
    });
    setFormErrors({ ...formErrors, ...errors });
    return results.every(x => x);
  }

  function onSaveHandler(event) {
    // event.preventDefault();
    let sameValues = is_new
      ? {
          sell_amount: config.buy_amount,
          sell_market: config.buy_market
        }
      : {};
    let newConfig = { ...config, ...sameValues };
    if (validateForm(newConfig)) {
      setConfig(newConfig);
      console.log(newConfig);
      onSubmit(newConfig)
        // getFormResult(config, account)
        .then(() => {
          setConfig({});
          console.log(newConfig);
        })
        .catch(e => {
          console.log(e);
          displayToast(e);
          //e == ['coin','buy_market']
        });
    } else {
      let isMyObjectEmpty = !Object.keys(newConfig).length;
      if (isMyObjectEmpty) {
        setDisplayText(true);
        console.log(newConfig);
      } else {
        console.log(newConfig);
        setDisplayText(false);
        setConfig({});
        console.log(displayText);
      }

      // onsubmit(newConfig);console.log(isNull(newConfig));

      // (onSubmit()) {
      //   setDisplayText(true)
    }
  }

  //   function isNumberKey(evt){
  //     var charCode = (evt.which) ? evt.which : event.keyCode
  //     if (charCode > 31 && (charCode < 48 || charCode > 57))
  //         return false;
  //     return true;
  // }

  function getDecimalformat(numPlace) {
    let a = `%${numPlace / 10}f`;
    return a;
  }

  function getTimeInterval(val) {
    let newpp = val.replace("Hourly", "h").replace("Daily", "d");
    return newpp;
    //   });
  }

  const handleChange = input => e => {
    let value = e.target.value;
    if (e.target.type === "radio") {
      value = value === "true";
    } else if (input === "decimal_places" || input === "price_places") {
      value = getDecimalformat(value);
    } else if (input === "time_interval") {
      value = getTimeInterval(value);
    } else if (e.target.type === "number") {
      value = parseFloat(value);
    }

    let newConfig = { ...config, [input]: value };
    setConfig(newConfig);
    // onSubmit(newConfig)
  };
  function getSpreadForMarket() {
    return new Promise((resolve, reject) => resolve(0.003));
  }
  function onSpreadSubmit() {
    if (config.coin && config.buy_market) {
      getSpreadForMarket({ coin: config.coin, market: config.buy_market }).then(
        value => {
          setConfig({ ...config, spread: value });
          setFormErrors({ ...formErrors, spread: false });
        }
      );
    } else {
      setFormErrors({ ...formErrors, spread: true });
    }
    // setConfig({...config,spread:value})
  }
  return {
    config,
    handleChange,
    onSaveHandler,
    onSpreadSubmit,
    formErrors,
    validateForm,
    displayText,
    setDisplayText
  };
};
export const FormComponent = ({
  market,
  formFields = [],
  hiddenFields = [],
  componentProps = {},
  handleChange = () => {},
  config = {},
  onSpreadSubmit,
  formErrors = {},
  fieldsToUnhide = [],
  validateForm
}) => {
  function getRadioValue(val) {
    // console.log(val);

    if (val) {
      if (typeof val === "boolean") {
        return val.toString();
      }
      return val;
    }
    return "false";
  }

  function getSelectValue(val) {
    if (["price_places", "decimal_places"].includes(val)) {
      let pp = config[val];
      if (pp) {
        if (pp.includes("f")) {
          let newpp = pp
            .replace("%", "")
            .replace(".", "")
            .replace("0", "")
            .replace("f", "");
          // console.log(newpp);
          return newpp;
        }
      }
    } else if ("time_interval".includes(val)) {
      let pp = config[val];
      if (pp) {
        let newpp = pp.replace("h", "Hourly").replace("d", "Daily");
        return newpp;
      }
    }
    return config[val];
  }

  let extraArray = ["profit_value", "pause", "margin_multiplier"];
  extraArray = extraArray.filter(x => !fieldsToUnhide.includes(x));
  if (config.take_profits) {
    extraArray = extraArray.filter(x => x !== "profit_value");
    hiddenFields.push("market_condition");
  } else {
    hiddenFields = hiddenFields.filter(x => x !== "market_condition");
  }
  if (market) {
    extraArray = extraArray.filter(x => x !== "pause");
  }
  if (config.margin_support) {
    extraArray = extraArray.filter(x => x !== "margin_multiplier");
    hiddenFields = hiddenFields.filter(x => x !== "margin_market");
    // hiddenFields.push("margin_market");
  }
  let numberFields = [
    "spread_multiplier",
    "buy_amount",
    "sell_amount",
    "budget"
  ];

  return (
    <>
      {formFields.map(field => {
        let actualField;
        if (market && field.name === "coin") {
          extraArray.push("coin");
        }

        if (field.field_type === "radio") {
          actualField = (
            <RadioGroup
              {...componentProps}
              // tabIndex="1"
              // defaultValue={market ? !!config[field.name] : "false"}
              value={getRadioValue(config[field.name])}
              onChange={handleChange(field.name)}
              display={extraArray.includes(field.name) ? "none" : "inline-flex"}
            >
              <Radio mr={1} value="true">
                True
              </Radio>
              <Radio value="false">False</Radio>
            </RadioGroup>
          );
        } else if (Array.isArray(field.options)) {
          actualField = (
            <Select
              {...componentProps}
              // tabIndex="1"
              isInvalid={formErrors[field.name]}
              id={field.name}
              placeholder={field.label}
              value={getSelectValue(field.name)}
              onChange={handleChange(field.name)}
              display={hiddenFields.includes(field.name) ? "none" : "inherit"}
            >
              {field.options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          );
        } else {
          // actualField =
          actualField = (
            <InputComponent
              // tabIndex="1"
              hiddenFields={[...hiddenFields, ...extraArray]}
              numberFields={numberFields}
              field={field}
              config={config}
              onSpreadSubmit={onSpreadSubmit}
              isInvalid={formErrors[field.name]}
              handleChange={handleChange}
              onBlur={() => {
                validateForm(config);
              }}
            />
          );
        }
        return (
          <FormControl key={field.name} mb={1} mx={3} isRequired>
            {![...hiddenFields, ...extraArray].includes(field.name) && (
              <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
            )}
            {actualField}
          </FormControl>
        );
      })}
    </>
  );
};

const SpreadInput = ({ onSpreadSubmit, config, ...props }) => {
  return (
    <InputGroup size="md">
      <Input {...props} type="number" />
      <InputRightElement>
        <Button size="sm" onClick={onSpreadSubmit}>
          get
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};
export const InputComponent = ({
  config = {},
  hiddenFields = [],
  numberFields = [],
  handleChange = {},
  field = {},
  onSpreadSubmit,
  ...componentProps
}) => {
  let C = field.name === "spread" ? SpreadInput : Input;
  return hiddenFields.includes(field.name) ? null : (
    <C
      {...componentProps}
      onSpreadSubmit={onSpreadSubmit}
      config={config}
      name={field.name}
      id={field.name}
      value={config[field.name]}
      placeholder={field.label}
      onChange={handleChange(field.name)}
      type={numberFields.includes(field.name) ? "number" : "text"}
      display={hiddenFields.includes(field.name) ? "none" : "inherit"}
    />
  );
};

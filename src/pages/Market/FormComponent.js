import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../../utils";
import {
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  InputGroup,
  Button,
  InputRightElement
} from "@chakra-ui/core";

function convertToNumber(val) {
  let toNum = parseInt(val);
  return toNum;
}

export const useFormState = (defaultconfig, onSubmit) => {
  // const { getMarketConfig, supported_markets } = useContext(AppContext);
  let [oldConfig, setOldConfig] = useState(defaultconfig);
  let [formErrors, setFormErrors] = useState({});
  let [config, setConfig] = useState({ max_trade_count: 1 });

  useEffect(() => {
    setConfig({ max_trade_count: 1, ...defaultconfig });
  }, []);

  function onSaveHandler(event) {
    event.preventDefault();
    onSubmit(config)
      // getFormResult(config, account)
      .then(() => {
        setConfig({});
        console.log(config);
      })
      .catch(e => {});
  }

  //   function isNumberKey(evt){
  //     var charCode = (evt.which) ? evt.which : event.keyCode
  //     if (charCode > 31 && (charCode < 48 || charCode > 57))
  //         return false;
  //     return true;
  // }

  function convertToNumer(val) {
    let toNum = parseInt(val);
    return toNum;
  }

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
    console.log(newConfig);
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
  return { config, handleChange, onSaveHandler, onSpreadSubmit, formErrors };
};
export const FormComponent = ({
  market,
  formFields = [],
  hiddenFields = [],
  componentProps = {},
  handleChange = () => {},
  config = {},
  onSpreadSubmit,
  formErrors = {}
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

  let extraArray = ["profit_value", "pause"];
  if (config.take_profits) {
    extraArray = extraArray.filter(x => x !== "profit_value");
  }
  if (market) {
    extraArray = extraArray.filter(x => x !== "pause");
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
              hiddenFields={[...hiddenFields, ...extraArray]}
              numberFields={numberFields}
              field={field}
              config={config}
              onSpreadSubmit={onSpreadSubmit}
              isInvalid={formErrors[field.name]}
              handleChange={handleChange}
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
  return (
    <C
      {...componentProps}
      onSpreadSubmit={onSpreadSubmit}
      config={config}
      name={field.name}
      id={field.name}
      value={config[field.name]}
      placeholder={field.label}
      onBlur={handleChange(field.name)}
      type={numberFields.includes(field.name) ? "number" : "text"}
      display={hiddenFields.includes(field.name) ? "none" : "inherit"}
    />
  );
};

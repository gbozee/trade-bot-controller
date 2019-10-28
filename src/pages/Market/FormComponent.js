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

// export const FormSubmitHandler = ({render,market})=>{

//   const {config, handleChange,onSaveHandler} = useFormState(market)

//   return render(onSaveHandler,config,handleChange)
// }

function convertToNumber(val) {
  let toNum = parseInt(val);
  return toNum;
}

export const useFormState = (defaultconfig, onSubmit) => {
  // const { getMarketConfig, supported_markets } = useContext(AppContext);
  let [oldConfig, setOldConfig] = useState(defaultconfig)
  let [config, setConfig] = useState({});

  useEffect(() => {
    
    setConfig(defaultconfig);
  }, [defaultconfig]);

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
  return { config, handleChange, onSaveHandler };
};
export const FormComponent = ({
  market,
  formFields = [],
  componentProps = {},
  handleChange = () => {},
  config = {}
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
  return (
    <>
      {formFields.map(field => {
        let actualField;
        if (field.field_type === "radio") {
          actualField = (
            <RadioGroup
              {...componentProps}
              // defaultValue={market ? !!config[field.name] : "false"}
              value={getRadioValue(config[field.name])}
              display="inline-flex"
              onChange={handleChange(field.name)}
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
            >
              {field.options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          );
        } else {
          actualField = (
            <InputComponent
              field={field}
              config={config}
              handleChange={handleChange}
            />
          );
        }
        if (market && field.name === "coin") {
          return null;
        }
        return (
          <FormControl key={field.name} mb={1} mx={3} isRequired>
            <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
            {actualField}
          </FormControl>
        );
      })}
    </>
  );
};

export const InputComponent = ({
  componentProps = {},
  config = {},
  handleChange = {},
  field = {}
}) => {
  const [show, setShow] = useState(false);
  function getValue() {}
  if (field.name === "spread_multiplier") {
    return (
      <>
        <InputGroup size="md">
          <Input
            {...componentProps}
            name={field.name}
            id={field.name}
            value={config[field.name]}
            placeholder={field.label}
            onBlur={handleChange(field.name)}
            type="number"
          />
          <InputRightElement>
            <Button size="sm" onClick={getValue}>
              get
            </Button>
          </InputRightElement>
        </InputGroup>
      </>
    );
  } else if (field.name === "coin") {
    return (
      <>
        <Input
          {...componentProps}
          name={field.name}
          id={field.name}
          value={config[field.name]}
          placeholder={field.label}
          onBlur={handleChange(field.name)}
        />
      </>
    );
  }
  return (
    <>
      <Input
        {...componentProps}
        name={field.name}
        id={field.name}
        value={config[field.name]}
        placeholder={field.label}
        onBlur={handleChange(field.name)}
        type="number"
      />
    </>
  );
};

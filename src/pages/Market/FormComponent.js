import React, { useEffect, useContext, useState } from "react";
import { AppContext } from "../../utils";
import {
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select
} from "@chakra-ui/core";

// export const FormSubmitHandler = ({render,market})=>{

//   const {config, handleChange,onSaveHandler} = useFormState(market)

//   return render(onSaveHandler,config,handleChange)
// }
export const useFormState = market => {
  const { getMarketConfig, supported_markets } = useContext(AppContext);

  let [config, setConfig] = useState({});

  useEffect(() => {
    if (market) {
      let configuration = getMarketConfig(market);
      setConfig(configuration);
    }
  }, [market]);

  function onSaveHandler(event) {
    event.preventDefault();

    console.log(config);
  }

  function getDecimalformat(numPlace) {
    let a = `%${numPlace / 10}f`;
    return a;
  }

  const handleChange = input => e => {
    let value = e.target.value;
    if (input === "decimal_places" || input === "price_places") {
      value = getDecimalformat(value);
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
  return (
    <>
      {formFields.map(field => {
        let actualField;
        if (field.field_type === "radio") {
          actualField = (
            <RadioGroup
              {...componentProps}
              defaultValue={market ? !!config[field.name] : "false"}
              value={config[field.name]}
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
              // value={config[field.name]}

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
            <Input
              {...componentProps}
              name={field.name}
              id={field.name}
              value={config[field.name]}
              placeholder={field.label}
              onChange={handleChange(field.name)}
            />
          );
        }
        if (market && field.name === "coin") {
          return null;
        }
        return (
          <FormControl mb={1} mx={3} isRequired>
            <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
            {actualField}
          </FormControl>
        );
      })}
    </>
  );
};

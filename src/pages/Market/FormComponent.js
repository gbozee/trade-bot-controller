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

export const FormComponent = ({
  market,
  formFields = [],
  componentProps = {}
}) => {
  const { getMarketConfig, supported_markets } = useContext(AppContext);

  let [config, setConfig] = useState({});
  useEffect(() => {
    if (market) {
      let configuration = getMarketConfig(market);
      setConfig(configuration);
    }
  }, [market]);

  const handleChange = input => e => {
    setConfig({ ...config, [input]: e.target.value });
  };

  return (
    <>
      {formFields.map(field => {
        let actualField;
        if (field.field_type === "radio") {
          actualField = (
            <RadioGroup
              {...componentProps}
              defaultValue={!!config[field.name]}
              display="inline-flex"
              onChange={handleChange(config[field.name])}
            >
              <Radio mr={1} value={true}>
                True
              </Radio>
              <Radio value={false}>False</Radio>
            </RadioGroup>
          );
        } else if (Array.isArray(field.options)) {
          actualField = (
            <Select
              {...componentProps}
              id={field.name}
              placeholder={field.label}
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

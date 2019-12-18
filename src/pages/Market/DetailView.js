import { Flex, Box, Button } from "@chakra-ui/core";
import { GridLayout, MenuComponent } from "./Components";
import React, { useState } from "react";

import { FormComponent, useFormState } from "./FormComponent";

function ConfigurationComponent({ params, onSubmit }) {
  let [selectedFields, setSelectedFields] = useState([]);
  const {
    displayText,
    setDisplayText,
    onSaveHandler,
    ...formParams
  } = useFormState(undefined, onSubmit, false, true);
  return (
    <Box>
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
    </Box>
  );
}

const DetailView = ({
  markets,
  filteredItem = " ",
  addOrRemoveMarkets,
  selectedMarkets,
  updated,
  getFormFields,
  onSubmit
}) => {
  function getFilterItem() {
    if (filteredItem === "All" || filteredItem === " ") {
      return markets;
    } else {
      let filteredmarket = markets.filter(x => x.buy_market === filteredItem);
      return filteredmarket;
    }
  }
  return (
    <Flex
      flexDirection="column"
      justifyContent={["space-between", "inherit"]}
      mx={3}
      minHeight="90vh"
    >
      {/*Grid layout for markets */}
      <GridLayout
        items={getFilterItem()}
        onSelect={addOrRemoveMarkets}
        selectedMarkets={selectedMarkets}
        update={updated}
        overflowY="scroll"
      />
      {selectedMarkets.length > 1 ? (
        <ConfigurationComponent
          params={getFormFields("bulk")}
          onSubmit={onSubmit}
        />
      ) : null}
    </Flex>
  );
};

export default DetailView;

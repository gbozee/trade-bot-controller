import React from 'react'
import { Box, Text } from '@chakra-ui/core';
export const NavigationBar = ({ title = "", children }) => {
    return (
      <Box
        bg="tomato"
        alignItems="center"
        justifyContent="space-between"
        w="100%"
        p={4}
        color="white"
        display="flex"
      >
        <Text>{title}</Text>
        {children}
      </Box>
    );
  };
  
import React from "react";
import {
  Box,
  Text,
  Breadcrumb,
  Icon,
  BreadcrumbItem,
  BreadcrumbLink,
  IconButton
} from "@chakra-ui/core";
import { Link } from "react-router-dom";
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

export const SubNavigationBar = ({ routes, ...rest }) => {
  return (
    <Breadcrumb
      spacing="8px"
      separator={<Icon color="gray.300" name="chevron-right" />}
      {...rest}
    >
      {routes.map(route => (
        <BreadcrumbItem key={route.name} isCurrentPage={route.current}>
          <BreadcrumbLink as={Link} to={route.path}>
            {route.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export const ControlButton = ({ edit, onEdit, onAdd, btnRef, ...rest }) => {
  return (
    <IconButton
      size="lg"
      position="fixed"
      ref={btnRef}
      borderRadius="50%"
      {...rest}
    />
  );
};

export { Modal } from "./Modal";

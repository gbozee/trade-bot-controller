import React, { useState } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import { AppProvider } from "./utils";
import { devAdapter, prodAdapter } from "./data";
const rootElement = document.getElementById("root");
//Documentation for the styling library is located at https://chakra-ui.com/button
ReactDOM.render(
  <AppProvider adapter={prodAdapter}>
    <ThemeProvider>
      <CSSReset />
      <App />
    </ThemeProvider>
  </AppProvider>,
  rootElement
);

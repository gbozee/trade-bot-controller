import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Market, Home } from "./pages";

function App() {
  return (
    <BrowserRouter>
        <Switch>
          <div>
            <Route path="/:account/markets" component={Market} />
            <Route path="/" exact component={Home} />
          </div>
        </Switch>
    </BrowserRouter>
  );
}

export default App;

import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Market, Home, Login, MarketDetail } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Switch>
          <Route exact path="/markets/:market" component={MarketDetail} />
          <Route exact path="/:account/markets" component={Market} />
          <Route
            exact
            path="/:account/markets/:market"
            component={MarketDetail}
          />
          <Route path="/login" component={Login} />
          <Route path="/" exact component={Home} />
        </Switch>
      </Switch>
    </BrowserRouter>
  );
}

export default App;

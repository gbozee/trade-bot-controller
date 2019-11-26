import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Market, Home, Login, MarketDetail } from "./pages";

function IndividualAccount({ match, location }) {

  // const pageProps = useAccountMarket(match.params.account);
  return (
    <Switch>
      <Route exact path={match.path} component={Market} />
      <Route exact path={`${match.path}/:market`} component={MarketDetail} />
    </Switch>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Switch>
          <Route exact path="/markets/:market" component={MarketDetail} />
          <Route path="/:account/markets" component={IndividualAccount} />
          <Route path="/login" component={Login} />
          <Route path="/" exact component={Home} />
        </Switch>
      </Switch>
    </BrowserRouter>
  );
}

export default App;

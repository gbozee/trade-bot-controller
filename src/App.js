import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Market, Home, Login, MarketDetail } from "./pages";
import { useAccountMarket } from "./hooks";

function IndividualAccount({ match, location }) {
  console.log(match);
  const pageProps = useAccountMarket(match.params.account);
  return (
    <Switch>
      <Route
        exact
        path={match.path}
        render={_routerProps => {
          return <Market {..._routerProps} pageProps={pageProps} />;
        }}
      />
      <Route
        exact
        path={`${match.path}/:market`}
        render={_routerProps => {
          return <MarketDetail {..._routerProps} pageProps={pageProps} />;
        }}
      />
     
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

import React from 'react';
import debug from "debug";

import {NavigationContainer} from "../src"
import AuthSwitchNav from "./navigators/AuthSwitchNav";
import Paths from "./constants/Paths";

debug.enable("navigation");

export default function App() {
  return (
    <NavigationContainer>
      <AuthSwitchNav
        path={Paths.AuthSwitch}
        initialPath={Paths.Auth}
      />
    </NavigationContainer>
  );
}

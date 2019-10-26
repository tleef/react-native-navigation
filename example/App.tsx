import React from 'react';

import {NavigationContainer} from "../src"
import AuthSwitchNav from "./navigators/AuthSwitchNav";
import Paths from "./constants/Paths";

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

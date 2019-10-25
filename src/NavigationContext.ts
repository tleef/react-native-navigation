import React from "react";
import { NavigationContextValue } from "./types";

const NavigationContext = React.createContext<NavigationContextValue | null>(
  null
);
NavigationContext.displayName = "NavigationContext";

export default NavigationContext;

import Navigator from "./Navigator";
import { Address, NavigatorProps } from "../types";

export default class SwitchNavigator<
  P extends NavigatorProps = NavigatorProps,
  S = {},
  SS = any
> extends Navigator<P, S, SS> {
  _getPreviousAddress(): Address | undefined {
    return undefined;
  }
}

import Navigator from "./Navigator";
import { Address } from "../types/types";

export default class SwitchNavigator extends Navigator {
  _getPreviousAddress(): Address | undefined {
    return undefined;
  }
}

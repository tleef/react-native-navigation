import Navigator from "./Navigator";
import { Address, NavigatorProps, TransitionEvent } from "../types";

export default class StackNavigator<
  P extends NavigatorProps = NavigatorProps,
  S = {},
  SS = any
> extends Navigator<P, S, SS> {
  private readonly prevAddresses: Address[] = [];

  update(transition: TransitionEvent) {
    if (this.latestAddress) {
      this.prevAddresses.push(this.latestAddress);
    }

    super.update(transition);
  }

  _getPreviousAddress(): Address | undefined {
    if (this.prevAddresses.length) {
      return this.prevAddresses.pop();
    }
  }
}

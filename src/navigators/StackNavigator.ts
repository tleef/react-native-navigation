import Navigator from "./Navigator";
import { Address, NavigatorProps, TransitionEvent } from "../types";

export default class StackNavigator<
  P extends NavigatorProps = NavigatorProps,
  S = {},
  SS = any
> extends Navigator<P, S, SS> {
  private readonly prevAddresses: Address[] = [];
  private goingBack: boolean = false;

  update(transition: TransitionEvent) {
    if (this.latestAddress && !this.goingBack) {
      this.prevAddresses.push(this.latestAddress);
    }

    this.goingBack = false;
    super.update(transition);
  }

  _getPreviousAddress(): Address | undefined {
    if (this.prevAddresses.length) {
      this.goingBack = true;
      return this.prevAddresses.pop();
    }
  }
}

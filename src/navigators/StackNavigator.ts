import Navigator from "./Navigator";
import { Address } from "../types/types";

export default class StackNavigator extends Navigator {
  private readonly prevAddresses: Address[] = [];

  update(address: Address) {
    if (this.latestAddress) {
      this.prevAddresses.push(this.latestAddress);
    }

    super.update(address);
  }

  _getPreviousAddress(): Address | undefined {
    if (this.prevAddresses.length) {
      return this.prevAddresses.pop();
    }
  }
}

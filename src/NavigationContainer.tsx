import React from "react";
import NavigationContext from "./NavigationContext";
import {Address, ContainerProps, INavigator, NavigationContextValue, ScreenEntry} from "./types";
import Navigator from "./navigators/Navigator";
import Screen from "./Screen";
import invariant from "tiny-invariant";

export default class NavigationContainer extends React.PureComponent<ContainerProps> implements INavigator {
  protected readonly navigationContextValue: NavigationContextValue;
  protected navigator?: Navigator;

  constructor(props: ContainerProps) {
    super(props);

    let mixins = props.mixins || [];

    this.navigationContextValue = {
      navigation: {
        navigator: this,
        mixins
      }
    }
  }

  componentDidMount() {
    if (this.navigator) {
      // navigate to entry screen
      this.navigator.navigate(
        this.navigator.props.path
      );
    }
  }

  get latestAddress(): Address | undefined {
    if (!this.navigator || !this.navigator.latestEntry) {
      return;
    }

    let navigator = this.navigator;
    while (navigator.latestEntry && navigator.latestEntry.screen instanceof Navigator) {
      navigator = navigator.latestEntry.screen
    }

    invariant(
      navigator.latestAddress,
      `Active <Navigator> should have latest address`
    );

    return navigator.latestAddress
  }

  render() {
    const {children} = this.props;

    return (
      <NavigationContext.Provider value={this.navigationContextValue}>
        {children}
      </NavigationContext.Provider>
    )

  }

  register(entry: ScreenEntry) {
    if (!entry.pathway.length) {
      invariant(
        entry.screen instanceof Navigator,
        `<NavigationContainer> entry must be a <Navigator>`
      );
      invariant(
        !this.navigator,
        `Only one <Navigator> can be registered with <NavigationContainer>`
      );
      // add child as path handler
      this.navigator = (entry.screen as Navigator);
    }
  }

  unregister(path: string, screen: Screen) {
    // check if screen is current navigator
    if (this.navigator === screen) {
      // remove navigator
      this.navigator = undefined;
    }
  }

  async navigate(
    path: string,
    props?: any,
    parse?: boolean,
    from?: Address,
  ) {
    throw new Error("Can't call `navigate()` on <NavigationContainer>")
  }

  async goBack() {
    if (this.navigator) {
      return this.navigator.goBack();
    }
  }

  private async _navigate(
    path: string,
    props?: any,
    parse = true,
    from = this.latestAddress,
  ) {
    if (this.navigator) {
      return this.navigator.navigate(path, props, parse, from);
    }
  }
}

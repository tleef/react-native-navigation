import React from "react";
import NavigationContext from "./NavigationContext";
import {Address, ContainerProps, INavigator, NavigationContextValue, ScreenEntry} from "./types";
import Navigator from "./navigators/Navigator";
import Screen from "./Screen";
import invariant from "tiny-invariant";
import debug from "debug";

export default class NavigationContainer extends React.PureComponent<ContainerProps> implements INavigator {
  protected readonly navigationContextValue: NavigationContextValue;
  protected navigator?: Navigator;

  constructor(props: ContainerProps, context: NavigationContextValue) {
    super(props, context);

    if (debug) {
      debug.enable("navigation:*");
    }

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

  getActiveAddress(): Address | undefined {
    return this.navigator && this.navigator.getActiveAddress();
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
      return this.navigator.goBack(true);
    }
  }

  private async _navigate(
    path: string,
    props?: any,
    parse = true,
    from = this.getActiveAddress(),
  ) {
    if (this.navigator) {
      return this.navigator.navigate(path, props, parse, from);
    }
  }
}

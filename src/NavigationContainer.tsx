import React from "react";
import NavigationContext from "./NavigationContext";
import {Address, ContainerProps, NavigationContextValue, NavigatorMap} from "./types/types";
import Navigator from "./navigators/Navigator";

export default class NavigationContainer extends React.PureComponent<ContainerProps> {
  protected readonly navigationContextValue: NavigationContextValue;
  protected readonly navigators: NavigatorMap = {};
  protected currentNavigator?: Navigator;

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

  get latestNavigator(): Navigator | undefined {
    if (!this.currentNavigator) {
      return;
    }

    let navigator = this.currentNavigator;
    while (navigator.latestScreen instanceof Navigator) {
      navigator = navigator.latestScreen;
    }

    return navigator;
  }

  get latestAddress(): Address | undefined {
    let navigator = this.latestNavigator;

    if (!navigator || !navigator.latestPath) {
      return;
    }

    return {
      path: navigator.latestPath,
      props: navigator.latestProps,
    }
  }

  render() {
    const {children} = this.props;

    return (
      <NavigationContext.Provider value={this.navigationContextValue}>
        {children}
      </NavigationContext.Provider>
    )

  }

  register(path: string, navigator: Navigator) {
    // add child as path handler
    this.navigators[path] = navigator;
  }

  unregister(path: string, navigator: Navigator) {
    // check if screen is current path handler
    if (this.navigators[path] === navigator) {
      // remove path
      delete this.navigators[path];
    }
  }

  async navigate(
    path: string,
    props?: any,
    parse = true,
    from = this.latestAddress,
  ) {
    let navigator;

    // look for child navigator to handle path
    for (const p in this.navigators) {
      if (this.navigators.hasOwnProperty(p)) {
        if (p === path) {
          navigator = this.navigators[p];
        }
      }
    }

    // if no navigator found, error?
    if (!navigator) {
      return;
    }

    this.currentNavigator = navigator;
    return navigator.navigate(path, props, parse, from);
  }

  async goBack() {
    let navigator = this.latestNavigator;
    if (navigator) {
      return navigator.goBack();
    }
  }
}

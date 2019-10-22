import React from "react";
import queryString from "query-string";
import Screen from "../Screen";
import {
  Address,
  INavigator,
  NavigationContextValue,
  NavigatorProps,
  ScreenEntry,
  ScreenMap,
  TransitionEvent
} from "../types/types";
import NavigationContext from "../NavigationContext";
import invariant from "tiny-invariant";

export default abstract class Navigator extends Screen<NavigatorProps> implements INavigator {
  protected readonly screens: ScreenMap = {};
  protected readonly navigationContextValue: NavigationContextValue;
  public latestAddress?: Address;

  constructor(props: NavigatorProps) {
    super(props);

    const { navigation }: NavigationContextValue = this.context;

    let mixins = props.mixins || [];
    mixins = mixins.concat(navigation.mixins);

    this.navigationContextValue = {
      navigation: {
        navigator: this,
        mixins
      }
    };
  }

  get latestEntry() {
    return this.latestAddress && this.screens[this.latestAddress.path];
  }

  componentDidMount(): void {
    const { navigation }: NavigationContextValue = this.context;
    // register self
    super.componentDidMount();
    // register children
    for (const path in this.screens) {
      if (this.screens.hasOwnProperty(path)) {
        const entry = this.screens[path];
        navigation.navigator.register({
          screen: entry.screen,
          path: entry.path,
          pathway: [this.props.path, ...entry.pathway]
        });
      }
    }
  }

  componentWillUnmount(): void {
    const { navigation }: NavigationContextValue = this.context;
    // unregister children
    for (const path in this.screens) {
      if (this.screens.hasOwnProperty(path)) {
        navigation.navigator.unregister(path, this.screens[path].screen);
      }
    }
    // unregister self
    super.componentWillUnmount();
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
    const { navigation }: NavigationContextValue = this.context;
    // add child as path handler
    this.screens[entry.path] = entry;
    // add self to pathway and register with parent
    navigation.navigator.register({
      screen: entry.screen,
      path: entry.path,
      pathway: [this.props.path, ...entry.pathway]
    });
  }

  unregister(path: string, screen: Screen) {
    const { navigation }: NavigationContextValue = this.context;
    // check if screen is current path handler
    if (this.screens[path] && this.screens[path].screen === screen) {
      // remove path
      delete this.screens[path];
      // remove path from parent
      navigation.navigator.unregister(path, screen);
    }
  }

  async navigate(
    path: string,
    props?: any,
    parse = true,
    from = this.latestAddress
  ): Promise<void> {
    const { navigation }: NavigationContextValue = this.context;

    if (parse) {
      const parsed = queryString.parseUrl(path);

      path = parsed.url;
      props = Object.assign({}, parsed.query, props);
    }

    if (path === this.props.path) {
      path = this.props.initialPath;
      props = Object.assign({}, this.props.initialProps, props)
    }

    // if path is not registered, ask parent to handle path
    if (!this.screens[path]) {
      return navigation.navigator.navigate(path, props, false, from);
    }

    let transition = {
      from,
      to: {
        path,
        props
      }
    };

    let toEntry = this._getToEntry(transition);
    let fromEntry = this._getFromEntry(transition);

    // this navigator is not the nearest common ancestor
    if (fromEntry === toEntry) {
      let navigatorEntry = this.screens[fromEntry.pathway[0]];
      invariant(
        navigatorEntry && navigatorEntry.screen instanceof Navigator,
        `<Navigator> missing from pathway ${fromEntry.pathway[0]}`
      );
      return (navigatorEntry.screen as Navigator).navigate(path, props, false, from);
    }

    return this.transition(transition);
  }

  async goBack(): Promise<void> {
    const latestEntry = this.latestEntry;
    if (latestEntry && latestEntry.screen instanceof Navigator) {
      return latestEntry.screen.goBack();
    }

    const prevAddress = this._getPreviousAddress();
    if (prevAddress) {
      return this.navigate(prevAddress.path, prevAddress.props, false);
    }
  }

  async transition(transition: TransitionEvent) {
    let fromEntry = this._getFromEntry(transition);
    let toEntry = this._getToEntry(transition);

    invariant(
      fromEntry !== toEntry,
      `<Navigator> is not nearest common ancestor of ${(transition.from || {}).path} and ${transition.to.path}`
    );

    if (fromEntry) {
      try {
        fromEntry.screen.onBeforeLeave(transition);
      } catch (e) {
        // do nothing;
      }
      try {
        await fromEntry.screen.leave(transition);
      } catch (e) {
        // do nothing;
      }
      try {
        fromEntry.screen.onAfterLeave(transition);
      } catch (e) {
        // do nothing;
      }
    }

    this.update(transition);

    try {
      toEntry.screen.onBeforeEnter(transition);
    } catch (e) {
      // do nothing;
    }
    try {
      await toEntry.screen.enter(transition);
    } catch (e) {
      // do nothing;
    }
    try {
      toEntry.screen.onAfterEnter(transition);
    } catch (e) {
      // do nothing;
    }
  }

  onBeforeLeave(transition: TransitionEvent) {
    // First, tell child to leave
    const fromEntry = this._getFromEntry(transition);
    if (fromEntry) {
      try {
        fromEntry.screen.onBeforeLeave(transition);
      } catch (e) {
        // do nothing
      }
    }
    // Then, leave
    super.onBeforeLeave(transition);
  }

  async leave(transition: TransitionEvent) {
    // First, tell child to leave
    const fromEntry = this._getFromEntry(transition);
    if (fromEntry) {
      try {
        await fromEntry.screen.leave(transition);
      } catch (e) {
        // do nothing;
      }
    }
    // Then, leave
    await super.leave(transition);
  }

  onAfterLeave(transition: TransitionEvent) {
    // First, tell child to leave
    const fromEntry = this._getFromEntry(transition);
    if (fromEntry) {
      try {
        fromEntry.screen.onAfterLeave(transition);
      } catch (e) {
        // do nothing;
      }
    }
    // Then, leave
    super.onAfterLeave(transition);
  }

  update(transition: TransitionEvent) {
    const entry = this._getToEntry(transition);

    this.latestAddress = {
      path: entry.path,
      props: entry.path === transition.to.path ? transition.to.props : undefined
    };

    if (entry.screen instanceof Navigator) {
      entry.screen.update(transition);
    }
  }

  onBeforeEnter(transition: TransitionEvent) {
    // First, enter
    super.onBeforeEnter(transition);
    // Then, tell child to enter
    const toEntry = this._getToEntry(transition);
    try {
      toEntry.screen.onBeforeEnter(transition);
    } catch (e) {
      // do nothing
    }
  }

  async enter(transition: TransitionEvent) {
    // First, enter
    await super.enter(transition);
    // Then, tell child to enter
    const toEntry = this._getToEntry(transition);
    try {
      await toEntry.screen.enter(transition);
    } catch (e) {
      // do nothing
    }
  }

  onAfterEnter(transition: TransitionEvent) {
    // First, enter
    super.onAfterEnter(transition);
    // Then, tell child to enter
    const toEntry = this._getToEntry(transition);
    try {
      toEntry.screen.onAfterEnter(transition);
    } catch (e) {
      // do nothing
    }
  }

  private _getFromEntry(transition: TransitionEvent) {
    let fromEntry: ScreenEntry | undefined;
    if (transition.from) {
      fromEntry = this.screens[transition.from.path];
      invariant(
        fromEntry,
        `<Navigator> does not contain ${transition.from.path}`
      );
      if (fromEntry.pathway.length) {
        fromEntry = this.screens[fromEntry.pathway[0]];
        invariant(
          fromEntry && fromEntry.screen instanceof Navigator,
          `<Navigator> missing from pathway ${fromEntry.pathway[0]}`
        );
      }
      const latestEntry = this.latestEntry;
      invariant(
        latestEntry === fromEntry,
        `<Navigator> out of sync`
      );
    }
    return fromEntry;
  }

  private _getToEntry(transition: TransitionEvent) {
    let toEntry = this.screens[transition.to.path];
    invariant(
      toEntry,
      `<Navigator> does not contain ${transition.to.path}`
    );
    if (toEntry.pathway.length) {
      toEntry = this.screens[toEntry.pathway[0]];
      invariant(
        toEntry && toEntry.screen instanceof Navigator,
        `<Navigator> missing from pathway ${toEntry.pathway[0]}`
      );
    }
    return toEntry
  }

  abstract _getPreviousAddress(): Address | undefined;
}

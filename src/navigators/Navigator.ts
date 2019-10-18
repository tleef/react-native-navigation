import queryString from "query-string";
import Screen from "../Screen";
import { Address, TransitionEvent } from "../types/types";

type ScreenMap = { [key: string]: Screen };

export default abstract class Navigator extends Screen {
  protected readonly screens: ScreenMap = {};
  protected latestAddress?: Address;

  get latestScreen() {
    return this.latestAddress && this.screens[this.latestAddress.path];
  }

  componentDidMount(): void {
    // register self
    super.componentDidMount();

    const { navigation } = this.context;
    // register children
    for (const path in this.screens) {
      if (this.screens.hasOwnProperty(path)) {
        navigation.navigator.register(path, this);
      }
    }
  }

  componentWillUnmount(): void {
    // unregister self
    super.componentWillUnmount();

    const { navigation } = this.context;
    // unregister children
    for (const path in this.screens) {
      if (this.screens.hasOwnProperty(path)) {
        navigation.navigator.unregister(path, this);
      }
    }
  }

  register(path: string, screen: Screen) {
    const { navigation } = this.context;
    // add child as path handler
    this.screens[path] = screen;
    // add self as path handler on parent
    navigation.navigator.register(path, this);
  }

  unregister(path: string, screen: Screen) {
    const { navigation } = this.context;
    // check if screen is current path handler
    if (this.screens[path] === screen) {
      // remove path
      delete this.screens[path];
      // remove path from parent
      navigation.navigator.unregister(path, this);
    }
  }

  async navigate(
    path: string,
    props: any,
    parse = true,
    from = this.latestAddress
  ) {
    const { navigation } = this.context;

    if (parse) {
      const parsed = queryString.parseUrl(path);

      path = parsed.url;
      props = Object.assign({}, parsed.query, props);
    }

    let screen;

    // look for child screen to handle path
    for (const p in this.screens) {
      if (this.screens.hasOwnProperty(p)) {
        if (p === path) {
          screen = this.screens[p];
        }
      }
    }

    // if no screen found, ask parent to handle path
    if (!screen) {
      return navigation.navigator.navigate(path, props, false, from);
    }

    return this.transition({
      from,
      to: {
        path,
        props
      }
    });
  }

  async goBack() {
    const prevAddress = this._getPreviousAddress();
    if (prevAddress) {
      return this.navigate(prevAddress.path, prevAddress.props, false);
    }
  }

  async transition(transition: TransitionEvent) {
    let latestScreen = this.latestScreen;
    const screen = this.screens[transition.to.path];

    if (latestScreen === screen) {
      return;
    }

    if (latestScreen) {
      try {
        latestScreen.onBeforeLeave(transition);
      } catch (e) {
        // do nothing;
      }
      try {
        await latestScreen.leave(transition);
      } catch (e) {
        // do nothing;
      }
      try {
        latestScreen.onAfterLeave(transition);
      } catch (e) {
        // do nothing;
      }
    }

    this.update(transition.to);

    try {
      screen.onBeforeEnter(transition);
    } catch (e) {
      // do nothing;
    }
    try {
      await screen.enter(transition);
    } catch (e) {
      // do nothing;
    }
    try {
      screen.onAfterEnter(transition);
    } catch (e) {
      // do nothing;
    }
  }

  update(address: Address) {
    this.latestAddress = address;
  }

  abstract _getPreviousAddress(): Address | undefined;
}

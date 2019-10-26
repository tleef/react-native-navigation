import React from "react";
import {IScreen, NavigationContextValue, ScreenProps, TransitionEvent} from "./types";
import NavigationContext from "./NavigationContext";
import invariant from "tiny-invariant";

export default class Screen<P extends ScreenProps = ScreenProps, S = {}, SS = any> extends React.PureComponent<P, S, SS> implements IScreen {
  static contextType = NavigationContext;

  protected navigationProps: any;

  constructor(props: P, context: NavigationContextValue) {
    super(props, context);

    invariant(
      this.context && this.context.navigation,
      `You should not use <Screen> outside of a <Navigator>`
    );
  }

  componentDidMount() {
    const { path } = this.props;
    const { navigation } = this.context;
    navigation.navigator.register({
      screen: this,
      path: path,
      pathway: [],
    });
  }

  componentWillUnmount() {
    const { path } = this.props;
    const { navigation } = this.context;
    navigation.navigator.unregister(path, this);
  }

  render() {
    return this.props.children;
  }

  onBeforeEnter(transition: TransitionEvent) {
    const { path, onBeforeEnter } = this.props;
    const { navigation } = this.context;

    if (transition.to.path === path) {
      this.navigationProps = transition.to.props;
    }

    if (onBeforeEnter) {
      try {
        onBeforeEnter(transition);
      } catch (e) {
        // do nothing
      }
    }

    for (let mixin of navigation.mixins) {
      if (mixin.onBeforeEnter) {
        try {
          mixin.onBeforeEnter(transition);
        } catch (e) {
          // do nothing
        }
      }
    }
  }

  public async enter(transition: TransitionEvent) {}

  onAfterEnter(transition: TransitionEvent) {
    const { onAfterEnter } = this.props;
    const { navigation } = this.context;

    if (onAfterEnter) {
      try {
        onAfterEnter(transition);
      } catch (e) {
        // do nothing
      }
    }

    for (let mixin of navigation.mixins) {
      if (mixin.onAfterEnter) {
        try {
          mixin.onAfterEnter(transition);
        } catch (e) {
          // do nothing
        }
      }
    }
  }

  onBeforeLeave(transition: TransitionEvent) {
    const { onBeforeLeave } = this.props;
    const { navigation } = this.context;

    if (onBeforeLeave) {
      try {
        onBeforeLeave(transition);
      } catch (e) {
        // do nothing
      }
    }

    for (let mixin of navigation.mixins) {
      if (mixin.onBeforeLeave) {
        try {
          mixin.onBeforeLeave(transition);
        } catch (e) {
          // do nothing
        }
      }
    }
  }

  public async leave(transition: TransitionEvent) {}

  onAfterLeave(transition: TransitionEvent) {
    const { onAfterLeave } = this.props;
    const { navigation } = this.context;

    if (onAfterLeave) {
      try {
        onAfterLeave(transition);
      } catch (e) {
        // do nothing
      }
    }

    for (let mixin of navigation.mixins) {
      if (mixin.onAfterLeave) {
        try {
          mixin.onAfterLeave(transition);
        } catch (e) {
          // do nothing
        }
      }
    }
  }
}

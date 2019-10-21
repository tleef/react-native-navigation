import React from "react";
import { ScreenProps, TransitionEvent } from "./types/types";
import NavigationContext from "./NavigationContext";
import invariant from "tiny-invariant";

export default class Screen<P extends ScreenProps = ScreenProps> extends React.PureComponent<P> {
  static contextType = NavigationContext;

  constructor(props: P) {
    super(props);

    invariant(
      this.context && this.context.navigation,
      `You should not use <Screen> outside of a <Navigator>`
    );
  }

  componentDidMount() {
    const { path } = this.props;
    const { navigation } = this.context;
    navigation.navigator.register(path, this);
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
    const { onBeforeEnter } = this.props;
    const { navigation } = this.context;

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

  public enter(transition: TransitionEvent) {}

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

  public leave(transition: TransitionEvent) {}

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

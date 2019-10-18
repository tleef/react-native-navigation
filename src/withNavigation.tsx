import React, {useContext} from "react";
import hoistStatics from "hoist-non-react-statics";
import invariant from "tiny-invariant";
import NavigationContext from "./NavigationContext";

/**
 * A public higher-order component to access the imperative API
 */
function withNavigation(Component: React.ComponentClass) {
  const displayName = `withNavigation(${Component.displayName || Component.name})`;
  const C = (props: any) => {
    const context = useContext(NavigationContext);

    invariant(
      context,
      `You should not use <${displayName} /> outside of a <Navigator>`
    );

    const {
      wrappedComponentRef,
      ...remainingProps
    } = props;

    return (
      <Component
        {...remainingProps}
        {...context}
        ref={wrappedComponentRef}
      />
    );
  };

  C.displayName = displayName;
  C.WrappedComponent = Component;

  return hoistStatics(C, Component);
}

export default withNavigation;

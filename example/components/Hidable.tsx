import React from "react";
import { View, StyleSheet } from "react-native";

interface IProps {
  hide: boolean;
  style?: any;
}

export default class Hidable extends React.PureComponent<IProps> {
  render() {
    const { hide, children, style = {}, ...rest_props } = this.props;
    const hideStyle = hide ? styles.hidden : {};

    return (
      <View {...rest_props} style={[style, hideStyle]}>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  hidden: {
    height: 0,
    borderWidth: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0
  }
});

import React from "react";
import {StyleSheet, View} from "react-native";

import {SwitchNavigator, NavigationContextValue, NavigatorProps} from "../../src";
import Paths from "../constants/Paths";
import AuthNav from "../navigators/AuthNav"
import AppScreen from "../screens/AppScreen"

interface IState {
  showAuth: boolean;
  showApp: boolean;
}

export default class AuthSwitchNav extends SwitchNavigator<NavigatorProps, IState> {
  constructor(props: NavigatorProps, context: NavigationContextValue) {
    super(props, context);

    this.state = {
      showAuth: false,
      showApp: false,
    };

    this.onAuthEnter = this.onAuthEnter.bind(this);
    this.onAuthLeave = this.onAuthLeave.bind(this);
    this.onAppEnter = this.onAppEnter.bind(this);
    this.onAppLeave = this.onAppLeave.bind(this);
  }

  renderChildren() {
    const { showAuth, showApp } = this.state;

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <AppScreen
          active={showApp}
          path={Paths.App}
          onBeforeEnter={this.onAppEnter}
          onAfterLeave={this.onAppLeave}
        />
        <AuthNav
          active={showAuth}
          path={Paths.Auth}
          initialPath={Paths.SignUp}
          onBeforeEnter={this.onAuthEnter}
          onAfterLeave={this.onAuthLeave}
        />
      </View>
    );
  }

  onAuthEnter() {
    this.setState({
      showAuth: true,
    });
  }

  onAuthLeave() {
    this.setState({
      showAuth: false,
    });
  }

  onAppEnter() {
    this.setState({
      showApp: true,
    });
  }

  onAppLeave() {
    this.setState({
      showApp: false,
    });
  }
}

import React from "react";
import {StyleSheet, View} from "react-native";

import {StackNavigator, NavigationContextValue, NavigatorProps} from "../../src";
import Paths from "../constants/Paths";
import SignUpScreen from "../screens/SignUpScreen"
import LoginScreen from "../screens/LoginScreen"

interface IProps extends NavigatorProps {
  active: boolean;
}

interface IState {
  showSignUp: boolean;
  showLogin: boolean;
}

export default class AuthNav extends StackNavigator<IProps, IState> {
  constructor(props: IProps, context: NavigationContextValue) {
    super(props, context);

    this.state = {
      showSignUp: false,
      showLogin: false,
    };

    this.onSignUpEnter = this.onSignUpEnter.bind(this);
    this.onSignUpLeave = this.onSignUpLeave.bind(this);
    this.onLoginEnter = this.onLoginEnter.bind(this);
    this.onLoginLeave = this.onLoginLeave.bind(this);
  }

  renderChildren() {
    const {active} = this.props;
    const { showSignUp, showLogin } = this.state;

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <SignUpScreen
          active={active && showSignUp}
          path={Paths.SignUp}
          onBeforeEnter={this.onSignUpEnter}
          onAfterLeave={this.onSignUpLeave}
        />
        <LoginScreen
          active={active && showLogin}
          path={Paths.Login}
          onBeforeEnter={this.onLoginEnter}
          onAfterLeave={this.onLoginLeave}
        />
      </View>
    );
  }

  onSignUpEnter() {
    this.setState({
      showSignUp: true,
    });
  }

  onSignUpLeave() {
    this.setState({
      showSignUp: false,
    });
  }

  onLoginEnter() {
    this.setState({
      showLogin: true,
    });
  }

  onLoginLeave() {
    this.setState({
      showLogin: false,
    });
  }
}

import React from "react";
import {Image, Platform, StyleSheet} from "react-native";
import Constants from "expo-constants";
import {
  Button,
  Container,
  Content, Text,
  Title,
  View,
} from "native-base";

import {Screen, NavigationContextValue, ScreenProps} from "../../src";
import Hidable from "../components/Hidable";
import Paths from "../constants/Paths";

interface IProps extends ScreenProps {
  active: boolean;
}

interface IState {
  alias: string;
  password: string;
  showPassword: boolean;
}

export default class AppScreen extends Screen<IProps, IState> {
  constructor(props: IProps, context: NavigationContextValue) {
    super(props, context);

    this.state = {
      alias: "",
      password: "",
      showPassword: false,
    };
  }

  render() {
    const {active} = this.props;

    return (
      <Hidable hide={!active} style={StyleSheet.absoluteFill}>
        <Container
          style={{
            paddingTop: Platform.OS === "ios" ? 0 : Constants.statusBarHeight
          }}
        >
          <Content>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                height: 200
              }}
            >
              <Image
                source={require("../assets/logo.png")}
                style={{ width: 60, height: 60, marginBottom: 10 }}
              />
              <Title style={{ fontSize: 30, color: "#000" }}>App</Title>
            </View>
            <View style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}>
              <Button transparent onPress={() => this._logout()}>
                <Text>Log out</Text>
              </Button>
            </View>
          </Content>
        </Container>
      </Hidable>
    );
  }

  private _logout() {
    this.context.navigation.navigator.navigate(Paths.Auth);
  }
}

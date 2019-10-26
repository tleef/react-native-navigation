import React from "react";
import {Image, Platform, StyleSheet} from "react-native";
import Constants from "expo-constants";
import {
  Container,
  Content,
  Title,
  Button,
  Text,
  View,
  Item,
  Input,
  Icon,
  Form,
} from "native-base";

import {Screen, NavigationContextValue, ScreenProps} from "../../src";
import Paths from "../constants/Paths";
import Hidable from "../components/Hidable";

interface IProps extends ScreenProps {
  active: boolean;
}

interface IState {
  alias: string;
  password: string;
  showPassword: boolean;
}

export default class LoginScreen extends Screen<IProps, IState> {
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
              <Title style={{ fontSize: 30, color: "#000" }}>Login</Title>
            </View>
            <Form style={{ marginBottom: 20 }}>
              <Item style={{ marginBottom: 10 }}>
                <Icon active name={"person"} />
                <Input
                  value={this.state.alias}
                  onChangeText={alias =>
                    this.setState({ alias })
                  }
                  autoCapitalize={"none"}
                  autoCorrect={false}
                  keyboardType={"email-address"}
                  placeholder={"Email or Username"}
                />
              </Item>
              <Item>
                <Icon active name={"unlock"} />
                <Input
                  value={this.state.password}
                  onChangeText={password =>
                    this.setState({ password })
                  }
                  placeholder={"Password"}
                  autoCapitalize={"none"}
                  autoCorrect={false}
                  secureTextEntry={!this.state.showPassword}
                />
              </Item>
            </Form>
            <View padder>
              <Button block onPress={() => this._login()}>
                <Text>Login</Text>
              </Button>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text>Don't have an account?</Text>
              <Button transparent onPress={() => this._goToSignUp()}>
                <Text>Sign Up</Text>
              </Button>
            </View>
          </Content>
        </Container>
      </Hidable>
    );
  }

  private _login() {
    this.context.navigation.navigator.navigate(Paths.App);
  }

  private _goToSignUp() {
    this.context.navigation.navigator.navigate(Paths.SignUp);
  }
}

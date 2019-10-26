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
  name: string;
  email: string;
  password: string;
  showPassword: boolean;
}

export default class SignUpScreen extends Screen<IProps, IState> {
  constructor(props: IProps, context: NavigationContextValue) {
    super(props, context);

    this.state = {
      name: "",
      email: "",
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
              <Title style={{ fontSize: 30, color: "#000" }}>Sign Up</Title>
            </View>
            <Form style={{ marginBottom: 20 }}>
              <Item style={{ marginBottom: 10 }}>
                <Icon active name={"person"} />
                <Input
                  value={this.state.name}
                  onChangeText={name => this.setState({ name })}
                  autoCapitalize={"words"}
                  autoCorrect={false}
                  placeholder={"Name"}
                />
              </Item>
              <Item style={{ marginBottom: 10 }}>
                <Icon active name={"mail"} />
                <Input
                  value={this.state.email}
                  onChangeText={email =>
                    this.setState({ email })
                  }
                  autoCapitalize={"none"}
                  autoCorrect={false}
                  keyboardType={"email-address"}
                  placeholder={"Email"}
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
              <Button block onPress={() => this._signUp()}>
                <Text>Sign up</Text>
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
              <Text>Have an account?</Text>
              <Button transparent onPress={() => this._goToLogin()}>
                <Text>Log in</Text>
              </Button>
            </View>
          </Content>
        </Container>
      </Hidable>
    );
  }

  private _signUp() {
    this.context.navigation.navigator.navigate(Paths.App);
  }

  private _goToLogin() {
    this.context.navigation.navigator.navigate(Paths.Login);
  }
}

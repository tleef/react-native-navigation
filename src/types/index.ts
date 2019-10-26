import Screen from "../Screen";

export interface IScreen {
  onBeforeEnter: (t: TransitionEvent) => void;
  enter: (t: TransitionEvent) => Promise<void>;
  onAfterEnter: (t: TransitionEvent) => void;
  onBeforeLeave: (t: TransitionEvent) => void;
  leave: (t: TransitionEvent) => Promise<void>;
  onAfterLeave: (t: TransitionEvent) => void;
}

export interface INavigator {
  register: (entry: ScreenEntry) => void;
  unregister: (path: string, screen: Screen) => void;
  navigate: (
    path: string,
    props?: any,
    parse?: boolean,
    from?: Address
  ) => Promise<void>;
  goBack: () => Promise<void>;
}

export interface ScreenProps {
  path: string;
  onBeforeEnter?: (t: TransitionEvent) => void;
  onAfterEnter?: (t: TransitionEvent) => void;
  onBeforeLeave?: (t: TransitionEvent) => void;
  onAfterLeave?: (t: TransitionEvent) => void;
}

export interface NavigatorProps extends ScreenProps {
  initialPath: string;
  mixins?: Mixin[];
}

export interface ContainerProps {
  mixins?: Mixin[];
}

export interface NavigationContextValue {
  navigation: NavigationProp;
}

export interface NavigationProp {
  navigator: INavigator;
  mixins: Mixin[];
}

export interface Address {
  path: string;
  props?: any;
}

export interface TransitionEvent {
  from?: Address;
  to: Address;
}

export interface Mixin {
  onBeforeEnter?: (t: TransitionEvent) => void;
  onAfterEnter?: (t: TransitionEvent) => void;
  onBeforeLeave?: (t: TransitionEvent) => void;
  onAfterLeave?: (t: TransitionEvent) => void;
}

export interface ScreenEntry {
  screen: Screen<any, any, any>;
  path: string;
  pathway: string[];
}

export type ScreenMap = { [key: string]: ScreenEntry };

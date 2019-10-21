import Screen from "../Screen";
import Navigator from "../navigators/Navigator";

export interface Address {
  path: string;
  props?: any;
}

export interface ScreenProps {
  path: string;
  onBeforeEnter?: (t: TransitionEvent) => void;
  onAfterEnter?: (t: TransitionEvent) => void;
  onBeforeLeave?: (t: TransitionEvent) => void;
  onAfterLeave?: (t: TransitionEvent) => void;
}

export interface NavigatorProps extends ScreenProps {
  mixins?: Mixin[];
}

export interface ContainerProps {
  mixins?: Mixin[];
}

export interface NavigationContextValue {
  navigation: NavigationProp;
}

export interface NavigationProp {
  navigator: any;
  mixins: Mixin[];
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

export type ScreenMap = { [key: string]: Screen };
export type NavigatorMap = { [key: string]: Navigator };

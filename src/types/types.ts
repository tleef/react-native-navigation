export interface Address {
  path: string;
  props: any;
}

export interface ScreenProps {
  path: string;
  onBeforeEnter?: (t: TransitionEvent) => void;
  onAfterEnter?: (t: TransitionEvent) => void;
  onBeforeLeave?: (t: TransitionEvent) => void;
  onAfterLeave?: (t: TransitionEvent) => void;
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

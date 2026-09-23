"use client";

import { Component, type ReactNode } from "react";

type Props = {
  fallback: ReactNode;
  children: ReactNode;
};

type State = { failed: boolean };

export class WebGLErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.setState({ failed: true });
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

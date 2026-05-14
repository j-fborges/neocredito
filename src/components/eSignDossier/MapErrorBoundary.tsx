import { Component, type ReactNode } from "react";

interface MapErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface MapErrorBoundaryState {
  hasError: boolean;
}

// Justificativa para o uso de Class Component para a estruturação de um Error Boundary em ./DEV_CHOICES no item 2.19.
export default class MapErrorBoundary extends Component<
  MapErrorBoundaryProps,
  MapErrorBoundaryState
> {
  constructor(props: MapErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): MapErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

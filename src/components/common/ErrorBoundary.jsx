import { Component } from 'react';
import ErrorState from '../loaders/ErrorState';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          message="Something went wrong"
          onRetry={() => { this.setState({ hasError: false }); window.location.reload(); }}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

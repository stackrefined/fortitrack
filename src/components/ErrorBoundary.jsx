import React from "react";
import { logClientError } from "../utils/logClientError";
import { useUser } from "../contexts/UserContext";

export class ErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  async componentDidCatch(error, info) {
    this.setState({ hasError: true, error });
    // Log error to Firestore
    const userId = this.props.user?.uid || "unknown";
    await logClientError({
      error: error.message,
      stack: error.stack,
      userId,
      context: info.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: "red", padding: 24 }}>
          <h2>Something went wrong.</h2>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Wrapper to inject user context
export default function ErrorBoundary({ children }) {
  const { user } = useUser();
  return <ErrorBoundaryInner user={user}>{children}</ErrorBoundaryInner>;
}
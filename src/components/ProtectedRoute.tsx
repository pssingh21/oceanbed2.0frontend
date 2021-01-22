import React from "react";
import { Redirect } from "react-router-dom";

interface PrivateRotueProps {
  component: React.FC;
  path?: string;
  exact?: boolean;
}

class ProtectedRoute extends React.Component<PrivateRotueProps> {
  render() {
    const Component = this.props.component;
    const isAuthenticated =
      localStorage.getItem("token") && localStorage.getItem("user");

    return isAuthenticated ? (
      <Component />
    ) : (
      <Redirect to={{ pathname: "/" }} />
    );
  }
}

export default ProtectedRoute;

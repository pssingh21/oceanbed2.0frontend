import React, { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

const Dashboard = lazy(() => import("./components/Dashboard"));
const Home = lazy(() => import("./components/Home"));
const Login = lazy(() => import("./components/Login"));

const App: React.FC = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route exact={true} path="/" component={Home} />
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <Route component={Home} />
      </Switch>
    </Suspense>
  </Router>
);
export default App;

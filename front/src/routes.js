import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useIsAuthenticated } from "react-auth-kit";

import SignUp from "./pages/SingUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Error from "./pages/Error";

const PrivateRoute = ({ Component }) => {
  const isAuthenticated = useIsAuthenticated();
  const auth = isAuthenticated();
  return auth ? <Component /> : <Navigate to="/login" />;
};

export default function Rotas() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/home" element={<PrivateRoute Component={Home} />}></Route>
        <Route path="*" element={<Error />}></Route>
      </Routes>
    </Router>
  );
}

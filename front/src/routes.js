import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import SignUp from "./pages/SingUp";
import Login from "./pages/Login";

export default function Rotas() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Login />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
      </Routes>
    </Router>
  );
}

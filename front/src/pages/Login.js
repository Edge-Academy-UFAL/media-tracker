import React, { useEffect } from "react";
import { useSignIn } from "react-auth-kit";
import { Link, useNavigate } from "react-router-dom";

import { useRef } from "react";
import { Toast } from "primereact/toast";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";

import mediatracker from "../assets/mediatracker.svg";

export default function Login() {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const toast = useRef(null);

  useEffect(() => {
    const cookie = document.cookie;
    var fields = cookie.split(";");
    var token = null;

    for (var i = 0; i < fields.length; i++) {
      var f = fields[i].split("=");
      if (f[0].trim() === "_auth") {
        token = f[1];
        break;
      }
    }

    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill all the fields",
        life: 8000,
      });
    } else {
      toast.current.clear();

      const values = {
        email,
        password,
      };

      const response = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (data.error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Invalid email or password",
          life: 8000,
        });
      } else {
        toast.current.clear();
        signIn({
          token: data.token,
          expiresIn: 3600,
          tokenType: "Bearer",
          authState: { name: data.name },
        });
        navigate("/home");
      }
    }
  };
  return (
    <div className="flex h-full w-full flex-1 items-center flex-col justify-center px-6 py-12 lg:px-8 text-white">
      <div className="rounded-xl bg-primary-500 px-40 py-12 my-16">
        <Toast ref={toast} />
        <div className="flex flex-col items-center justify-center sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mt-8 w-80" src={mediatracker} alt="mediatracker's logo"></img>
          <h2 className="mt-24 text-center text-4xl font-bold leading-9 tracking-tight">Sign in to your account</h2>
        </div>

        <form className="space-y-6 mt-16" action="#" method="POST">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="E-mail"
            className="block w-full rounded-xl border-0 py-5 px-4 text-white text-lg outline-none shadow-sm bg-primary-700"
          />

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Password"
            className="block w-full rounded-xl border-0 py-5 px-4 text-white text-lg outline-none shadow-sm bg-primary-700"
          />

          <div>
            <button
              type="submit"
              className="flex w-full text-center justify-center rounded-xl bg-primary-300 px-3 py-4 text-2xl font-semibold leading-6 text-white shadow-sm transition hover:brightness-105"
              onClick={handleLogin}
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xl text-white opacity-30">
          Don’t have an account?{" "}
          <Link to="/" className="underline">
            Create here
          </Link>
        </p>
      </div>
    </div>
  );
}

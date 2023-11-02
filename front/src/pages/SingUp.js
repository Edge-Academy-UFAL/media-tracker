import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import Loading from "../components/Loading/Loanding";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";

import mediatracker from "../assets/mediatracker.svg";

export default function SignUp() {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

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

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const validateEmail = () => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    if (!emailRegex.test(email)) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Por favor, insira um e-mail válido",
        life: 8000,
      });
    } else {
      toast.current.clear();
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !email || !password) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Por favor, preencha todos os campos",
        life: 8000,
      });
    } else {
      toast.current.clear();
      if (password !== confirmPassword) {
        toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "As senhas não coincidem",
          life: 8000,
        });
      } else {
        setIsLoading(true);
        toast.current.clear();
        const values = {
          name,
          email,
          password,
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        if (data.error) {
          setIsLoading(false);
          toast.current.show({
            severity: "error",
            summary: "Erro",
            detail: data.error,
            life: 8000,
          });
        } else {
          setIsLoading(false);
          navigate("/login?newUser=true");
        }
      }
    }
  };

  return (
    <div className="flex h-full w-full flex-1 items-center flex-col justify-center text-white">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="rounded-xl bg-primary-500 px-40 py-12">
          <Toast ref={toast} />
          <div className="flex flex-col items-center justify-center sm:mx-auto sm:w-full sm:max-w-sm">
            <img className="mt-2 w-80" src={mediatracker} alt="mediatracker's logo"></img>
            <h2 className="mt-16 text-center text-4xl font-bold leading-9 tracking-tight">Create your account</h2>
          </div>

          <form className="space-y-6 mt-12" action="#">
            <input
              id="name"
              maxLength={20}
              name="text"
              type="email"
              autoComplete="email"
              required
              placeholder="Name"
              className="block w-full rounded-xl border-0 py-5 px-4 text-white text-lg outline-none shadow-sm bg-primary-700"
            />

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="E-mail"
              className="block w-full rounded-xl border-0 py-5 px-4 text-white text-lg outline-none shadow-sm bg-primary-700"
              onChange={handleEmailChange}
              onBlur={validateEmail}
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
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="current-confirm-password"
              required
              placeholder="Confirm Password"
              className="block w-full rounded-xl border-0 py-5 px-4 text-white text-lg outline-none shadow-sm bg-primary-700"
            />

            <div>
              <button
                type="submit"
                className="flex w-full text-center justify-center rounded-xl bg-primary-300 px-3 py-4 text-2xl font-semibold leading-6 text-white shadow-sm transition hover:brightness-105"
                onClick={handleSignUp}
              >
                Sign up
              </button>
            </div>
            <p className="mt-6 text-center text-xl text-white opacity-30">
              Already have an account?{" "}
              <Link to="/login" className="underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

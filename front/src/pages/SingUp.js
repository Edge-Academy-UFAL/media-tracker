import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const validateEmail = () => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    if (!emailRegex.test(email)) {
      setEmailError("Por favor, insira um e-mail válido");
    } else {
      setEmailError("");
    }
  };

  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !email || !password) {
      return alert("Preencha todos os campos");
    }
    if (password !== confirmPassword) {
      return alert("As senhas não coincidem");
    }

    if (emailError) {
      return;
    }

    const values = {
      nome: name,
      email,
      senha: password,
    };

    const response = await fetch(`http://localhost:${process.env.PORT}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (response.status === 201) {
      navigate("/login");
    }

    if (response.status === 400) {
      return alert("Email já cadastrado");
    }
  };

  return (
    <div className="flex h-full w-full flex-1 items-center flex-col justify-center px-6 py-12 lg:px-8 text-white">
      <div className="rounded-xl bg-primary-500 px-40 py-8 my-16">
        <div className="flex flex-col items-center justify-center sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mt-8 w-80"
            src="./mediatracker.svg"
            alt="mediatracker's logo"
          ></img>
          <h2 className="mt-24 text-center text-4xl font-bold leading-9 tracking-tight">
            Create your account
          </h2>
        </div>

        <form className="space-y-6 mt-16" action="#">
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
          {emailError && <p className="text-red-500 text-s">{emailError}</p>}

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
              Sign in
            </button>
          </div>
          <p className="mt-6 text-center text-xl text-white opacity-30">
            Already have an account?{" "}
            <span
              className="underline"
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer" }}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

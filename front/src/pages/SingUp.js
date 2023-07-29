import React from "react";

import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full h-full w-full flex-1 items-center flex-col justify-center px-6 py-12 lg:px-8 text-white">
      <div className="h-full rounded-xl bg-primary-500 px-40 py-8 my-16">
        <div className="flex flex-col items-center justify-center sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mt-8 w-80" src="./mediatracker.svg" alt="mediatracker's logo"></img>
          <h2 className="mt-24 text-center text-4xl font-bold leading-9 tracking-tight">
            Create your account
          </h2>
        </div>

        <form className="space-y-6 mt-16" action="#">
          <input
            id="name"
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
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xl text-white opacity-30">
          Don’t have an account?{" "}
          <span className="underline" onClick={() => navigate("/")}>
            Create here
          </span>
        </p>
      </div>
    </div>
  );
}

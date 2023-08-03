import React from "react";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    showInfo(); // Chamando a função showInfo assim que a página for carregada
  }, []);
  const signOut = useSignOut();
  const navigate = useNavigate();
  // const cookies = useCookies();
  function handleLogout() {
    signOut();
    navigate("/login");
  }

  async function showInfo() {
    // URL-encoded email parameter
    const cookie = document.cookie;
    var field = cookie.split(";");
    var encodedEmailParam = field[3]?.split("=")[1];

    // Parse the decoded JSON string into an object
    if (!encodedEmailParam) {
      console.log("Encoded email parameter not found in the cookie");
      return;
    }

    const decodedEmailParam = decodeURIComponent(encodedEmailParam);

    try {
      // Check if the decodedEmailParam is a valid JSON string
      if (
        !decodedEmailParam.startsWith("{") ||
        !decodedEmailParam.endsWith("}")
      ) {
        console.log("Invalid JSON string:", decodedEmailParam);
        return;
      }

      const emailObject = JSON.parse(decodedEmailParam);

      if (!emailObject || !emailObject.email) {
        console.log("Invalid email object or email not found");
        return;
      }

      const email = emailObject.email;

      const response = await fetch(
        `http://localhost:${process.env.PORT}/users/userInfo/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data) {
        document.getElementById(
          "userInfo"
        ).innerHTML = `Bem vindo de volta, ${data.nome}!`;
      } else {
        console.log("No user info found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex h-full w-full flex-1 items-center flex-col justify-center px-6 py-12 lg:px-8 text-white">
      {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
      <h1 className="mt-6 text-center pb-12 text-white text-6xl" id="userInfo">
        {/* User info will be displayed here */}
      </h1>
      <div>
        <button
          onClick={handleLogout}
          className="text-center justify-center rounded-xl bg-primary-300 px-3 py-4 text-2xl font-semibold leading-6 text-white shadow-sm transition hover:brightness-105"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

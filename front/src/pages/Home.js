import React from "react";
import { Link } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { useEffect } from "react";

import MovieFilter from "../components/Home/MovieFilter";
import Sidebar from "../components/Sidebar/Sidebar";
import Body from "../components/Body";

export default function Home() {
  useEffect(() => {
    showInfo();
  }, []);
  const signOut = useSignOut();

  async function showInfo() {
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
      const response = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/users/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.nome) {
        document.getElementById("nomeTela").innerHTML = data.nome;
      }
    }
  }

  function handleLogout() {
    signOut();
    window.location.reload();
  }

  return (
    <div className="h-full flex gap-1">
      <Sidebar handleLogout={handleLogout} />
      <Body>
        <div className="flex gap-10">
          <img src="mediatracker.svg" alt="mediatracker's logo" className="h-10"></img>
          <MovieFilter />
        </div>
        <div className="flex flex-col items-center h-full justify-center font-medium">
          <img src="/empty-icon.png" alt="" className="h-44" />
          <h2 className="text-5xl pt-10">Your movie library is empty</h2>
          <h3 className="italic text-white/50 text-xl pt-4">Add a movie to your collection</h3>
        </div>
        <Link
          to="/search"
          className="bg-primary-700 hover:brightness-125 transition text-white h-20 w-20 rounded-full absolute bottom-10 right-10 shadow-lg flex items-center justify-center"
        >
          <img src="/plus-icon.svg" alt="" className="w-10" />
        </Link>
      </Body>
    </div>
  );
}

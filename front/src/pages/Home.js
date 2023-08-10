import React from "react";
import { Link } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { useEffect } from "react";

import MovieFilter from "../components/Home/MovieFilter";
import Sidebar from "../components/Home/Sidebar/Sidebar";

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
      {/* content */}
      <div className="bg-primary-500 flex flex-col flex-[8] my-8 ml-14 mr-8 rounded-2xl shadow-2xl py-12 pl-14 pr-8 relative text-white">
        <div className="flex gap-10">
          <img src="mediatracker.svg" alt="mediatracker's logo" className="h-10"></img>
          <MovieFilter />
        </div>
        <div className="flex flex-col items-center h-full justify-center font-medium">
          <img src="/empty-icon.png" alt="" className="h-2/6" />
          <h2 className="text-3xl pt-10">Your movie library is empty</h2>
          <h3 className="italic text-white/50 text-md pt-4">Add a movie to your collection</h3>
        </div>
        <Link
          to="/search"
          className="bg-primary-700 transition duration-200 ease-in hover:brightness-110 hover:text-white text-white h-16 w-16 rounded-full absolute bottom-10 right-10 shadow-black/30 shadow-lg flex items-center justify-center"
        >
          <img src="/plus-icon.svg" alt="" className="w-8" />
        </Link>
      </div>
    </div>
  );
}

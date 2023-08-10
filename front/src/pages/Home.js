import React from "react";
import { Link } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { useEffect } from "react";
import { FaRightFromBracket, FaCompass, FaMagnifyingGlass, FaClapperboard } from "react-icons/fa6";

import MovieFilter from "../components/Home/MovieFilter";

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
    <div className="h-full flex gap-12 text-white">
      {/* sidebar */}
      <div className="bg-primary-500 flex flex-[3] flex-col">
        <div className="flex flex-1 justify-start items-start mt-12 mx-4">
          <div className="flex items-center bg-primary-700 w-full py-4 rounded-xl shadow-xl shadow-primary-700/30 gap-4">
            <div className="h-14 w-14 rounded-full bg-slate-600 ml-10"></div>
            <span className="text-2xl font-semibold ml-3" id="nomeTela">
              {/*  */}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-8 flex-2 justify-center items-center mx-4">
          <div className="flex items-center bg-primary-700 w-full py-6 rounded-xl shadow-xl shadow-primary-700/30 gap-4">
            <FaClapperboard size={36} className="ml-10" />
            <span className="text-2xl font-semibold ml-3">Movies</span>
          </div>
          <div className="flex items-center bg-primary-700 w-full py-6 rounded-xl shadow-xl shadow-primary-700/30 gap-4">
            <FaMagnifyingGlass size={36} className="ml-10" />
            <span className="text-2xl font-semibold ml-3">Search</span>
          </div>
          <div className="flex items-center bg-primary-700 w-full py-6 rounded-xl shadow-xl shadow-primary-700/30 gap-4">
            <FaCompass size={36} className="ml-10" />
            <span className="text-2xl font-semibold ml-3">Explore</span>
          </div>
        </div>
        <div className="flex flex-1 justify-center items-end mb-12 mx-4 cursor-pointer" onClick={handleLogout}>
          <div className="flex items-center bg-primary-700 w-full py-6 rounded-xl shadow-xl shadow-primary-700/30 gap-4">
            <FaRightFromBracket size={36} color="#C53434" className="ml-10" />
            <span className="text-2xl font-semibold ml-3 text-[#C53434]">Logout</span>
          </div>
        </div>
      </div>
      {/* content */}
      <div className="bg-primary-500 flex flex-col flex-[8] my-12 ml-16 mr-12 rounded-2xl shadow-2xl py-14 pl-16 pr-12 relative">
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
      </div>
    </div>
  );
}

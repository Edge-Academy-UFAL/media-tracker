import React from "react";
import { Link } from "react-router-dom";
import { useSignOut } from "react-auth-kit";

import MovieFilter from "../components/Home/MovieFilter";
import Sidebar from "../components/Sidebar/Sidebar";
import Body from "../components/Body";

import mediatracker from "../assets/mediatracker.svg";
import emptyIcon from "../assets/empty-icon.png";
import plusIcon from "../assets/plus-icon.svg";

export default function Home() {
  const signOut = useSignOut();

  function handleLogout() {
    signOut();
    window.location.reload();
  }

  return (
    <div className="h-full flex gap-1">
      <Sidebar handleLogout={handleLogout} />
      <Body>
        <div className="flex gap-10">
          <img src={mediatracker} alt="mediatracker's logo" className="h-10"></img>
          <MovieFilter />
        </div>
        <div className="flex flex-col items-center h-full justify-center font-medium">
          <img src={emptyIcon} alt="Your movie library is empty" className="h-44" />
          <h2 className="text-5xl pt-10">Your movie library is empty</h2>
          <h3 className="italic text-white/50 text-xl pt-4">Add a movie to your collection</h3>
        </div>
        <Link
          to="/search"
          className="bg-primary-700 hover:brightness-125 transition text-white h-20 w-20 rounded-full absolute bottom-10 right-10 shadow-lg flex items-center justify-center"
        >
          <img src={plusIcon} alt="Plus sign" className="w-10" />
        </Link>
      </Body>
    </div>
  );
}

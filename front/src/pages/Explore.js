import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import Body from "../components/Body";

import { FaWandMagicSparkles } from "react-icons/fa6";

import mediatracker from "../assets/mediatracker.svg";
import MovieList from "../components/MovieList";
import { useAuthUser } from "react-auth-kit";
import Skeleton from "../components/Skeleton";

export default function Explore() {
  const [data, setData] = useState({ results: [] });
  const [title, setTitle] = useState("");
  const [userMoviesIds, setUserMoviesIds] = useState([]);
  const [isLoading, setIsLoading] = useState(title !== "");
  const authUser = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();

  const token = authUser().token;

  return (
    <div className="h-full flex gap-1">
      <Sidebar />
      <Body>
        <div className="flex justify-between items-center">
          <img src={mediatracker} alt="mediatracker's logo" className="h-10 flex-1"></img>
          <div className="w-full flex justify-end">
            <span className="flex relative items-center">
              <div
                className="flex h-10 px-8 py-2 rounded-full shadow-md shadow-black/25 transition items-center"
                style={{ background: "rgba(159, 64, 192, 0.35)" }}
              >
                <span className="text-color-primary text-xl">powered with AI</span>{" "}
                <FaWandMagicSparkles size={20} className="text-white ml-3" />
              </div>
            </span>
          </div>
        </div>

        {isLoading && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 mt-12 overflow-y-auto">
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        )}
        {!isLoading && data.results?.length === 0 ? (
          <div className="overflow-y-hidden h-full items-center flex justify-center">
            <div className="flex items-center justify-center text-2xl font-semibold text-white/50 italic">
              Something went wrong...
            </div>
          </div>
        ) : (
          <MovieList data={data} userMoviesIds={userMoviesIds} />
        )}
      </Body>
    </div>
  );
}

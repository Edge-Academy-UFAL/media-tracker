import React from "react";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import Body from "../components/Body";

import { FaMagnifyingGlass } from "react-icons/fa6";

import mediatracker from "../assets/mediatracker.svg";
import MovieList from "../components/MovieList";
import { useAuthUser } from "react-auth-kit";


export default function Search() {
  const [data, setData] = useState({});
  const [title, setTitle] = useState("");
  const [userMoviesIds, setUserMoviesIds] = useState([]);
  // userMoviesIds = [[1, 'plan'], [2, 'completed'], [3, 'dropped']]
  const authUser = useAuthUser();

  const token = authUser().token;

  useEffect(() => {
    async function getUserMoviesPlan() {
      const received = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/users/movies?status=plan`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const movies = await received.json();
      if (movies.length > 0) {
        movies.forEach((movie) => {
          setUserMoviesIds((userMoviesIds) => [...userMoviesIds, [movie.tmdbId, 'plan']]);
        });
      }
    }

    async function getUserMoviesCompleted() {
      const received = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/users/movies?status=completed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const movies = await received.json();
      if (movies.length > 0) {
        movies.forEach((movie) => {
          setUserMoviesIds((userMoviesIds) => [...userMoviesIds, [movie.tmdbId, 'completed']]);
        });
      }
    }

    async function getUserMoviesDropped() {
      const received = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/users/movies?status=dropped`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const movies = await received.json();
      if (movies.length > 0) {
        movies.forEach((movie) => {
          setUserMoviesIds((userMoviesIds) => [...userMoviesIds, [movie.tmdbId, 'dropped']]);
        });
      }
    }

    getUserMoviesPlan();
    getUserMoviesCompleted();
    getUserMoviesDropped();
  }, [token]);

  useEffect(() => {
    async function getData() {
      const received = await fetch(`https://api.themoviedb.org/3/search/movie?query=${title}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
        },
      });

      const response = await received.json();
      setData(response);
    }

    getData();
  }, [title]);

  return (
    <div className="h-full flex gap-1">
      <Sidebar />
      <Body>
        <div className="flex gap-40">
          <img src={mediatracker} alt="mediatracker's logo" className="h-10 flex-1"></img>
          <div className="w-full">
            <span className="w-full flex relative items-center">
              <FaMagnifyingGlass className="h-7 w-7 absolute text-white/50 ml-7" />
              <input
                placeholder="Search..."
                className="w-full text-white/50 custom-input-style bg-primary-700 rounded-xl text-2xl italic font-medium border-none pl-20 py-4 shadow-xl transition focus:outline-none focus:ring-[3px] focus:ring-[#c7d2fe] focus:border-transparent"
                onChange={(e) => setTitle(e.target.value)}
              />
            </span>
          </div>
        </div>
        <MovieList data={data} page="search" userMoviesIds={userMoviesIds} />
      </Body>
    </div>
  );
}

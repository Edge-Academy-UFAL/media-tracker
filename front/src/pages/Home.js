import React, { useEffect, useState } from "react";
import { useAuthUser } from "react-auth-kit";

import MovieFilter from "../components/Home/MovieFilter";
import Sidebar from "../components/Sidebar/Sidebar";
import Body from "../components/Body";

import mediatracker from "../assets/mediatracker.svg";
import MovieList from "../components/MovieList";

export default function Home() {
  const [data, setData] = useState({});
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState("completed");
  const authUser = useAuthUser();

  const token = authUser().token;

  useEffect(() => {
    setData({ results: [] });
    setMovies([]);

    async function getMovie(tmdbId) {
      const response = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/movies/searchById/${tmdbId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const movie = await response.json();

      setMovies((movies) => [...movies, movie]);
    }

    async function getUserMovies() {
      const received = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/users/movies?status=${filter}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const movies = await received.json();
      if (movies.length > 0) {
        movies.forEach((movie) => {
          getMovie(movie.tmdbId);
        });
      }
    }
    getUserMovies();
  }, [filter]);

  useEffect(() => {

    // ignore dups
    const moviesResults = [...new Map(movies.map((movie) => [movie["id"], movie])).values()];
    setData({ results: moviesResults });
  }, [movies]);

  return (
    <div className="h-full flex gap-1">
      <Sidebar />
      <Body>
        <div className="flex gap-60">
          <img src={mediatracker} alt="mediatracker's logo" className="h-10"></img>
          <MovieFilter setFilter={setFilter} filter={filter} />
        </div>
        <MovieList data={data} page="home" />
      </Body>
    </div>
  );
}

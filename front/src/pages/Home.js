import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MovieFilter from "../components/Home/MovieFilter";
import Sidebar from "../components/Sidebar/Sidebar";
import Body from "../components/Body";

import mediatracker from "../assets/mediatracker.svg";
import MovieList from "../components/MovieList";

export default function Home() {
  const [data, setData] = useState({});
  const [movies, setMovies] = useState([]);
  const [token, setToken] = useState("");
  const [filter, setFilter] = useState("completed");
  const navigate = useNavigate();

  useEffect(() => {
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
    if (token === null) {
      navigate("/login");
    }
    setToken(token);
  }, [navigate]);

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
  }, [token, filter]);

  useEffect(() => {
    setData({ results: movies });
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

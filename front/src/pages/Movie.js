import { json, useParams } from "react-router-dom";
import React, { useRef, useState } from "react";
import { useSignOut } from "react-auth-kit";
import { useEffect } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import Body from "../components/Body";

import Mediatracker from "../assets/mediatracker.svg";
import noImageAvailable from "../assets/no-image-available.png";

import {
  FaClock,
  FaCircleCheck,
  FaCircleXmark,
  FaChevronDown,
  FaRegStar,
  FaRegStarHalfStroke,
  FaStar,
} from "react-icons/fa6";
import { Toast } from "primereact/toast";

export default function Movie() {
  const [movie, setMovie] = useState({});
  const params = useParams();
  const toast = useRef(null);
  const movieId = params.id;

  useEffect(() => {
    showInfo();
  }, []);

  useEffect(() => {
    async function getMovie() {
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

      const response = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/movies/searchById/${movieId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data);
      data["year"] = data["release_date"].split("-")[0];
      data["runtime"] =
        data["runtime"] > 60 ? `${Math.floor(data["runtime"] / 60)}h ${data["runtime"] % 60}m` : `${data["runtime"]}m`;
      data["production"] = data["production_companies"][0]["name"];
      data["emptyStars"] = Array(5 - Math.ceil(data["vote_average"] / 2)).fill(0);
      data["fullStars"] = Array(Math.floor(data["vote_average"] / 2)).fill(0);
      data["hasHalfStar"] = data["vote_average"] % 2 !== 0;
      data["genres"] = data["genres"].slice(0, 4);
      setMovie(data);
    }

    getMovie();
  }, [movieId]);

  const signOut = useSignOut();

  async function saveMovie(movie) {
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

    if (!token) {
      return;
    }

    const response = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/users/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    const id = data.id;

    const response2 = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/userMovies/`, {
      body: JSON.stringify({
        userId: id,
        filmeId: movie.id,
        situacao: "plan",
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data2 = await response2.json();
    console.log(data2);
    toast.current.show({
      severity: "success",
      summary: "Movie saved successfully",
      detail: `${movie.title} saved to your list`,
      life: 4000,
    });
  }

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
      <Toast ref={toast} />
      <Sidebar handleLogout={handleLogout} />
      <Body>
        <div className="flex gap-10">
          <img src={Mediatracker} alt="Mediatracker" className="h-10" />
        </div>
        <div className="flex mt-16">
          <div className="flex flex-col flex-[2] gap-10">
            {movie.poster_path ? (
              <>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-80 rounded-2xl"
                />
              </>
            ) : (
              <img src={noImageAvailable} alt={movie.title} className="w-80 rounded-2xl" />
            )}
            <div
              className="flex leading-[3.2rem] w-80 rounded-xl bg-secondary-700 text-white text-2xl font-semibold cursor-pointer transition hover:brightness-110"
              onClick={() => saveMovie(movie)}
            >
              <div className="flex w-4/5 items-center justify-center">
                <FaClock size={24} className="mr-3 mt-0.5" />
                Plan to watch
              </div>
              <div className="flex w-1/5 justify-center items-center border-l-[3px] border-primary-500/30">
                <FaChevronDown size={30} />
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-[4] max-h-[480px]">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-semibold line-clamp-2 pb-2" title={movie.title}>
                {movie.title}
              </h1>
              <div className="flex flex-col gap-4 mt-10 text-white/50">
                <h2 className="text-3xl font-bold">
                  {movie.year} | <span className="font-normal">{movie.production}</span> | {movie.runtime}
                </h2>
                <span className="text-2xl font-normal line-clamp-3">{movie.overview}</span>
              </div>
              {movie.genres && (
                <div className="flex gap-4 mt-10 text-xl font-semibold text-white">
                  {movie.genres.map((genre) => (
                    <div
                      key={genre.id}
                      className="flex-none bg-secondary-700 px-8 py-2 rounded-full shadow-md shadow-black/25 transition hover:shadow-black/70 cursor-pointer"
                    >
                      {genre.name}
                    </div>
                  ))}
                </div>
              )}
              {movie.fullStars && (
                <div className="flex gap-1 mt-10" title={movie.vote_average}>
                  {movie.fullStars.map((star) => (
                    <FaStar size={56} color="#FFC107" />
                  ))}
                  {movie.hasHalfStar && <FaRegStarHalfStroke size={58} color="#FFC107" />}
                  {movie.emptyStars.map((star) => (
                    <FaRegStar size={56} color="#FFC107" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Body>
    </div>
  );
}

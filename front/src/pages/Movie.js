import { useParams } from "react-router-dom";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useAuthUser } from "react-auth-kit";

import Sidebar from "../components/Sidebar/Sidebar";
import Body from "../components/Body";

import Mediatracker from "../assets/mediatracker.svg";
import noImageAvailable from "../assets/no-image-available.png";

import { FaFloppyDisk, FaRegStar, FaRegStarHalfStroke, FaStar } from "react-icons/fa6";
import { Toast } from "primereact/toast";
import SelectStatus from "../components/Movie/SelectStatus";

export default function Movie() {
  const [movie, setMovie] = useState({});
  const toast = useRef(null);
  const authUser = useAuthUser();
  const token = authUser().token;

  const params = useParams();
  const tmdbId = params.id;

  const [movieStatus, setMovieStatus] = useState("unset");
  const [movieId, setMovieId] = useState(null);

  const [rating, setRating] = useState(0);
  const [definitive, setDefinitive] = useState(false);

  const handleStarHover = (hoveredRating) => {
    if (!definitive) setRating(hoveredRating);
  };

  const setRatingDefinitive = (rating) => {
    setRating(rating);
    setDefinitive(true);
  };

  async function saveRating() {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/movies/${movieId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating: rating }),
    });

    if (response.status === 200) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Rating saved",
        life: 3000,
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An error occurred while saving your rating",
        life: 3000,
      });
    }
  }

  useEffect(() => {
   async function getMovieStatus() {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/movies/${tmdbId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        setMovieStatus("unset");
        return;
      }

      try {
        const data = await response.json();
        setMovieStatus(data.status);
        setMovieId(data.id);
        setRating(data.rating);
        if (data.rating) setDefinitive(true);
      } catch (err) {
        console.log(err);
      }
    }

    if (token && tmdbId) getMovieStatus();
    setDefinitive(false);
  }, [token, movieStatus]);

  useEffect(() => {
     async function getMovie() {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/movies/searchById/${tmdbId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data)
      setMovie(data);
     }
    
    if (token) getMovie();
  }, [token]);

  return (
    <div className="h-full flex gap-1">
      <Toast ref={toast} />
      <Sidebar />
      <Body>
        <div className="flex gap-10">
          <img src={Mediatracker} alt="Mediatracker" className="h-10" />
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex mt-16 flex-1">
            <div className="flex gap-10">
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
              <div className="max-w-2xl">
                <h1 className="text-4xl font-semibold line-clamp-2 pb-2" title={movie.title}>
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
                    {movie.fullStars.map((_, i) => (
                      <FaStar size={56} color="#FFC107" key={i} />
                    ))}
                    {movie.hasHalfStar && <FaRegStarHalfStroke size={58} color="#FFC107" />}
                    {movie.emptyStars.map((_, i) => (
                      <FaRegStar size={56} color="#FFC107" key={i} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="flex gap-10 max-h-[480px]">
              <SelectStatus
                token={token}
                toast={toast}
                tmdbId={tmdbId}
                movie={movie}
                title={movie.title}
                movieId={movieId}
                movieStatus={movieStatus}
                setMovieStatus={setMovieStatus}
              />
              {(movieStatus === "completed" || movieStatus === "dropped") && (
                <>
                  <div className="flex gap-1" onMouseLeave={() => handleStarHover(0)}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div
                        key={value}
                        onMouseEnter={() => handleStarHover(value)}
                        onMouseLeave={() => handleStarHover(rating)}
                        onClick={() => setRatingDefinitive(value)}
                      >
                        {value <= (rating || 0) ? (
                          <FaStar className="cursor-pointer text-secondary-700 w-14 h-14" />
                        ) : (
                          <FaRegStar className="cursor-pointer text-secondary-700 w-14 h-14" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex w-40 h-fit rounded-xl items-center text-2xl font-semibold py-3 justify-center gap-3 px-6 border-[5px] border-secondary-700 text-secondary-700 cursor-pointer transition hover:text-white hover:bg-secondary-700"
                    onClick={saveRating}>
                    <FaFloppyDisk className="w-7 h-7" />
                    Save
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Body>
    </div>
  );
}

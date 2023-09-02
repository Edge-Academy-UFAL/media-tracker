import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import Body from "../components/Body";

import { FaMagnifyingGlass } from "react-icons/fa6";

import mediatracker from "../assets/mediatracker.svg";
import noImageAvailable from "../assets/no-image-available.png";

export default function Search() {
  const [data, setData] = useState({});
  const [title, setTitle] = useState("");

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
        {data.results?.length ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 mt-12 overflow-y-auto">
            {data.results?.map((item) => (
              <Link
                to={`/movie/${item.id}`}
                key={item.id}
                className="mb-12 transition-opacity ease-in duration-100 hover:opacity-40"
              >
                {item.poster_path ? (
                  <>
                    <img
                      className="rounded-2xl w-[260px] h-[390px]"
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={item.title}
                    />
                  </>
                ) : (
                  <img className="rounded-2xl w-[260px] h-[390px]" src={noImageAvailable} alt={item.title} />
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="overflow-y-hidden h-full items-center flex justify-center">
            <div className="flex items-center justify-center text-2xl font-semibold text-white/50 italic">
              Start typing to search a movie you like
            </div>
          </div>
        )}
      </Body>
    </div>
  );
}

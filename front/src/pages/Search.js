import React from "react";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import Body from "../components/Body";
import { InputText } from "primereact/inputtext";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "./Search.css";
import "primeicons/primeicons.css";
import { useSignOut } from "react-auth-kit";
import { Link } from "react-router-dom";

import mediatracker from "../assets/mediatracker.svg";
import noImageAvailable from "../assets/no-image-available.png";

export default function Search() {
  const [data, setData] = useState({});
  const [title, setTitle] = useState("");
  const signOut = useSignOut();

  useEffect(() => {
    showInfo();
  }, []);

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
      <Body>
        <div className="flex gap-24">
          <img src={mediatracker} alt="mediatracker's logo" className="h-10 flex-1"></img>
          <div className="w-full mr-12">
            <span className="p-input-icon-left w-full">
              <i className="pi pi-search px-1" />
              <InputText
                placeholder="Search..."
                className="p-inputtext-lg custom-input-style w-full"
                onChange={(e) => setTitle(e.target.value)}
              />
            </span>
          </div>
        </div>
        <div
          className={`image-container ${
            data.results?.length > 0
              ? "justify-start self-start overflow-y-auto"
              : "items-center justify-center h-full overflow-hidden"
          }`}
        >
          {data.results?.length ? (
            data.results?.map((item) => (
              <Link
                to={`/movie/${item.id}`}
                key={item.id}
                className="image-item transition-opacity ease-in duration-100 hover:opacity-40"
              >
                {item.poster_path ? (
                  <>
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} />
                  </>
                ) : (
                  <img src={noImageAvailable} alt={item.title} />
                )}
              </Link>
            ))
          ) : (
            <div className="flex items-center justify-center text-2xl font-semibold text-white/50 italic">
              Start typing to search a movie you like
            </div>
          )}
        </div>
      </Body>
    </div>
  );
}

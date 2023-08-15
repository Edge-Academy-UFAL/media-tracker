import React from "react";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import Body from "../components/Body";
import { InputText } from "primereact/inputtext";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "./Search.css";
import "primeicons/primeicons.css";

export default function Search() {
  const [data, setData] = useState({});
  const [title, setTitle] = useState("");

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
      console.log(response);
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

  return (
    <div className="h-full flex gap-1">
      <Sidebar />
      <Body>
        <div className="flex items-center gap-28 ">
          <img src="/mediatracker.svg" alt="" className="h-10" />
          <div className="flex-grow">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                placeholder="Search..."
                className="p-inputtext-lg custom-input-style"
                onChange={(e) => setTitle(e.target.value)}
              />
            </span>
          </div>
        </div>
        <div className="image-container">
          {data.results?.map((item) => (
            <div key={item.id} className="image-item">
              {item.poster_path && (
                <>
                  <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} />
                </>
              )}
            </div>
          ))}
        </div>
      </Body>
    </div>
  );
}

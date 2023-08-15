import React from "react";
import { useEffect } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import Body from "../components/Body";
import { InputText } from "primereact/inputtext";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "./Search.css";
import "primeicons/primeicons.css";

export default function Search() {
  useEffect(() => {
    showInfo();
  }, []);
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
        <div className="flex gap-14">
          <img src="/mediatracker.svg" alt="" className="h-10" />
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText placeholder="Search..." className="p-inputtext-lg custom-input-style" />
          </span>
        </div>
        <div className="flex items-center h-full justify-center text-4xl text-gray-400 italic">
          <h3>Start typing to search a movie you like</h3>
        </div>
      </Body>
    </div>
  );
}

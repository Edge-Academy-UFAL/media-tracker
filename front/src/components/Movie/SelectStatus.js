import { FaChevronDown, FaCircleCheck, FaCircleQuestion, FaCircleXmark, FaClock } from "react-icons/fa6";

import "./SelectStatus.css";
import { useState } from "react";

export default function SelectStatus({ token, toast, tmdbId, movie, movieStatus, setMovieStatus }) {
  const [open, setOpen] = useState(false);

  const movieStatusString = {
    unset: "Select a status",
    plan: "Plan to watch",
    completed: "Completed",
    dropped: "Dropped",
  };

  async function saveMovie(movie) {
    if (!token) {
      return;
    }

    const response = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/users/movies/${tmdbId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "plan" }),
    });

    if (response.status !== 201) {
      const data = await response.json();
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: data.error,
        life: 4000,
      });
      return;
    }

    toast.current.show({
      severity: "success",
      summary: "Movie saved successfully",
      detail: `${movie.title} saved to your list`,
      life: 4000,
    });
  }

  return (
    <>
      {movieStatus === "unset" && <div>Adicionar</div>}
      <div className={`select-menu ${open && "active"}`}>
        <div className="select-btn bg-green-500" onClick={() => setOpen(!open)}>
          <div className="flex gap-4">
            {movieStatus === "unset" ? (
              <FaCircleQuestion size={24} />
            ) : movieStatus === "plan" ? (
              <FaClock size={24} />
            ) : movieStatus === "completed" ? (
              <FaCircleCheck size={24} />
            ) : (
              <FaCircleXmark size={24} />
            )}
            <span className="sBtn-text">{movieStatusString[movieStatus]}</span>
          </div>
          <FaChevronDown size={24} />
        </div>

        <ul className="options">
          <li className="option">
            <FaCircleQuestion size={24} />
            <span className="option-text">Select a status</span>
          </li>
          <li className="option">
            <FaCircleCheck size={24} />
            <span className="option-text">Completed</span>
          </li>
          <li className="option">
            <FaCircleXmark size={24} />
            <span className="option-text">Dropped</span>
          </li>
        </ul>
      </div>
    </>
  );
}

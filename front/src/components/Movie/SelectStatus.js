import { useState } from "react";
import { FaChevronDown, FaCircleCheck, FaCircleQuestion, FaCircleXmark, FaClock, FaPlus } from "react-icons/fa6";

import "./SelectStatus.css";

export default function SelectStatus({ token, toast, title, tmdbId, movie, movieId, movieStatus, setMovieStatus }) {
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

    setMovieStatus("plan");
    toast.current.show({
      severity: "success",
      summary: "Movie saved successfully",
      detail: `${title} saved to your list`,
      life: 4000,
    });
  }

  async function changeStatus(status) {
    if (!token) {
      return;
    }

    const response = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/users/movies/${movieId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (response.status !== 200) {
      const data = await response.json();
      console.log(data);
      toast.current.show({
        severity: "error",
        summary: "Error",
        life: 4000,
      });
      return;
    }

    setMovieStatus(status);
    toast.current.show({
      severity: "success",
      summary: "Status changed successfully",
      detail: `${title} is now ${movieStatusString[status]}`,
      life: 4000,
    });
    setOpen(false);
  }

  return (
    <>
      {movieStatus === "unset" ? (
        <div
          className="flex w-80 rounded-xl items-center text-2xl font-semibold py-2 justify-center gap-3 px-6 border-[5px] border-secondary-700 text-secondary-700 cursor-pointer transition hover:text-white hover:bg-secondary-700"
          onClick={() => saveMovie()}
        >
          <FaPlus size={24} />
          Add to your library
        </div>
      ) : (
        <div className={`select-menu ${open && "active"}`}>
          <div
            className={`select-btn  ${
              movieStatus === "plan"
                ? "bg-secondary-700"
                : movieStatus === "completed"
                ? "bg-[#609F6E]"
                : "bg-[#9F6060]"
            }`}
            onClick={() => setOpen(!open)}
          >
            <div className="flex gap-4 items-center font-semibold">
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
            <FaChevronDown size={32} />
          </div>

          <ul className="options">
            <li className="option" onClick={() => changeStatus("unset")}>
              <FaCircleQuestion size={24} />
              <span className="option-text">Select a status</span>
            </li>
            <li className="option" onClick={() => changeStatus("plan")}>
              <FaClock size={24} />
              <span className="option-text">Plan to watch</span>
            </li>
            <li className="option" onClick={() => changeStatus("completed")}>
              <FaCircleCheck size={24} />
              <span className="option-text">Completed</span>
            </li>
            <li className="option" onClick={() => changeStatus("dropped")}>
              <FaCircleXmark size={24} />
              <span className="option-text">Dropped</span>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

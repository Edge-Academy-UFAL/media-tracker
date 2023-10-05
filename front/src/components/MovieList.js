import { Link } from "react-router-dom";
import plusIcon from "../assets/plus-icon.svg";

import noImageAvailable from "../assets/no-image-available.png";
import emptyIcon from "../assets/empty-icon.png";
import { FaCircleCheck, FaCircleXmark, FaClock } from "react-icons/fa6";

export default function MovieList({ data, page, userMoviesIds }) {
  return (
    <>
      {data.results?.length ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 mt-12 overflow-y-auto">
          {data.results?.map((item) => (
            <Link
              to={`/movie/${item.id}`}
              key={item.id}
              className="relative mb-12 transition-opacity ease-in duration-100 hover:opacity-40"
            >
              {userMoviesIds?.find((id) => parseInt(id[0]) === item.id) && (
                <span
                  className={`absolute z-10 text-lg top-3 flex items-center justify-center gap-6 py-1 rounded-lg w-[240px] left-[10px] text-white font-semibold
                ${userMoviesIds?.find((id) => parseInt(id[0]) === item.id)[1] === "plan" ? "bg-secondary-700" : ""}
                ${userMoviesIds?.find((id) => parseInt(id[0]) === item.id)[1] === "completed" ? "bg-[#609F6E]" : ""}
                ${userMoviesIds?.find((id) => parseInt(id[0]) === item.id)[1] === "dropped" ? "bg-[#9F6060]" : ""}
                `}
                >
                  {userMoviesIds?.find((id) => parseInt(id[0]) === item.id)[1] === "plan" ? (
                    <FaClock size={24} />
                  ) : userMoviesIds?.find((id) => parseInt(id[0]) === item.id)[1] === "completed" ? (
                    <FaCircleCheck size={24} />
                  ) : userMoviesIds?.find((id) => parseInt(id[0]) === item.id)[1] === "dropped" ? (
                    <FaCircleXmark size={24} />
                  ) : (
                    ""
                  )}
                  {userMoviesIds?.find((id) => parseInt(id[0]) === item.id)[1] === "plan"
                    ? "Plan to watch"
                    : userMoviesIds?.find((id) => parseInt(id[0]) === item.id)[1] === "completed"
                    ? "Completed"
                    : userMoviesIds?.find((id) => parseInt(id[0]) === item.id)[1] === "dropped"
                    ? "Dropped"
                    : ""}
                </span>
              )}

              {item.poster_path ? (
                <>
                  <img
                    className={`rounded-2xl w-[260px] h-[390px] ${
                      userMoviesIds?.find((id) => parseInt(id[0]) === item.id) ? "opacity-40" : ""
                    }`}
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title}
                  />
                </>
              ) : (
                <img
                  className={`rounded-2xl w-[260px] h-[390px] ${
                    userMoviesIds?.find((id) => parseInt(id[0]) === item.id) ? "opacity-40" : ""
                  }`}
                  src={noImageAvailable}
                  alt={item.title}
                />
              )}
            </Link>
          ))}
        </div>
      ) : page === "search" ? (
        <div className="overflow-y-hidden h-full items-center flex justify-center">
          <div className="flex items-center justify-center text-2xl font-semibold text-white/50 italic">
            Start typing to search a movie you like
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center h-full justify-center font-medium">
            <img src={emptyIcon} alt="Your movie library is empty" className="h-44" />
            <h2 className="text-5xl pt-10">Your movie library is empty</h2>
            <h3 className="italic text-white/50 text-xl pt-4">Add a movie to your collection</h3>
          </div>
          <Link
            to="/search"
            className="bg-primary-700 hover:brightness-125 transition text-white h-20 w-20 rounded-full absolute bottom-10 right-10 shadow-lg flex items-center justify-center"
          >
            <img src={plusIcon} alt="Plus sign" className="w-10" />
          </Link>
        </>
      )}
    </>
  );
}

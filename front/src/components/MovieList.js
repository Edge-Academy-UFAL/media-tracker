import { Link } from "react-router-dom";
import plusIcon from "../assets/plus-icon.svg";

import noImageAvailable from "../assets/no-image-available.png";
import emptyIcon from "../assets/empty-icon.png";

export default function MovieList({ data, page }) {
  return (
    <>
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

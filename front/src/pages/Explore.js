import React from "react";
import { useNavigate } from "react-router-dom";

export default function Explore() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="text-5xl text-center font-semibold text-white/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        Explore page is under construction
      </h1>
      <button
      style={{ border: 'none', borderRadius: "10px"  }}
        onClick={() => {
          navigate("/home");
        }}
        className="text-3xl text-center font-semibold absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 w-80 h-28 bg-white/50  text-black"
      >
        Return to main page
      </button>
    </div>
  );
}

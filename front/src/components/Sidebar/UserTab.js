import { useEffect } from "react";
import { useAuthUser } from "react-auth-kit";


import { FaUser } from "react-icons/fa6";

export default function UserTab() {
  
  useEffect(() => {
    showInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const authUser = useAuthUser();

  const token = authUser().token;

  async function showInfo() {

    if (token) {
      const response = await fetch(`http://localhost:${process.env.REACT_APP_PORT}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.name) {
        document.getElementById("nomeTela").innerHTML = data.name;
      }
    }
  }

  return (
    <div className="flex flex-1 justify-start items-start mt-12 mx-4 text-white">
      <div className="flex items-center bg-primary-700 w-full py-4 rounded-xl shadow-xl shadow-primary-700/30 gap-4">
        <div className="h-14 w-14 rounded-full bg-slate-600 ml-10 flex items-center">
          {" "}
          <FaUser className="text-4xl ml-2.5"/>
        </div>
        <span className="text-2xl font-semibold ml-3" id="nomeTela" />
      </div>
    </div>
  );
}

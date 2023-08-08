import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    showInfo(); // Chamando a função showInfo assim que a página for carregada
  }, []);
  const signOut = useSignOut();
  const navigate = useNavigate();
  // const cookies = useCookies();
  function handleLogout() {
    signOut();
    navigate("/login");
  }

  async function showInfo() {
    // URL-encoded email parameter
    const cookie = document.cookie;
    var field = cookie.split(";");
    var encodedEmailParam = field[3]?.split("=")[1];

    // Parse the decoded JSON string into an object
    if (!encodedEmailParam) {
      console.log("Encoded email parameter not found in the cookie");
      return;
    }

    const decodedEmailParam = decodeURIComponent(encodedEmailParam);

    try {
      // Check if the decodedEmailParam is a valid JSON string
      if (!decodedEmailParam.startsWith("{") || !decodedEmailParam.endsWith("}")) {
        console.log("Invalid JSON string:", decodedEmailParam);
        return;
      }

      const emailObject = JSON.parse(decodedEmailParam);

      if (!emailObject || !emailObject.email) {
        console.log("Invalid email object or email not found");
        return;
      }

      const email = emailObject.email;

      const response = await fetch(`http://localhost:${process.env.PORT}/users/userInfo/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data) {
        document.getElementById("userInfo").innerHTML = `Bem vindo de volta, ${data.nome}!`;
      } else {
        console.log("No user info found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="h-full flex gap-12 text-white">
      {/* sidebar */}
      <div className="bg-primary-500 flex flex-[3]">Sidebar</div>
      {/* content */}
      <div className="bg-primary-500 flex flex-col flex-[8] my-12 ml-16 mr-12 rounded-2xl shadow-2xl py-14 pl-16 pr-12 relative">
        <div className="flex gap-10">
          <img src="mediatracker.svg" alt="mediatracker's logo" className="h-10"></img>
          <div className="flex bg-primary-700">
            <div className="flex hover:bg-slate-600">Plan to watch</div>
          </div>
        </div>
        <div className="flex flex-col items-center h-full justify-center font-medium">
          <img src="/empty-icon.png" alt="" className="w-72 h-36" />
          <h2 className="text-4xl pt-10">Your movie library is empty</h2>
          <h3 className="italic text-white/50 text-lg pt-4">Add a movie to your collection</h3>
        </div>
        <Link
          to="/search"
          className="bg-primary-700 text-white h-20 w-20 rounded-full absolute bottom-10 right-10 shadow-lg flex items-center justify-center"
        >
          <img src="/plus-icon.svg" alt="" className="w-10" />
        </Link>
      </div>
    </div>
  );
}

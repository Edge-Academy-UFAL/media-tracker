import { useEffect } from "react";

export default function UserTab() {
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
        <div className="h-14 w-14 rounded-full bg-slate-600 ml-10"></div>
        <span className="text-2xl font-semibold ml-3" id="nomeTela" />
      </div>
    </div>
  );
}

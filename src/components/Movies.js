import { useEffect, useState } from "react";

export default function Movies() {
    const [data, setData] = useState({});
    const [title, setTitle] = useState({});

    async function getData() {
        const received = await fetch(`https://api.themoviedb.org/3/search/movie?query=${title}`, {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZWVmY2M2M2M4NzljNjVlNzJmNTBmMjc2OTJlYmU2OSIsInN1YiI6IjY0YjU4YmI0YTZkZGNiMDBhZTZiMjg0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hHvoZNkUX7Si48aXNTcXIGWCO-v6oxJiIhdqjyIuSv8",
            },
        });

        const response = await received.json();
        console.log(response);
        setData(response);
    }

    return (
        <div>
            <h1>Busca de filmes?</h1>
            <input type="text" onChange={(e) => setTitle(e.target.value)} />
            <button onClick={() => getData()}>Pesquisar</button>

            {data.results?.map((item) => (
                <div className="flex" key={item.id}>
                    <h1>{item.title}</h1>
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} width="300px" />
                </div>
            ))}
        </div>
    );
}

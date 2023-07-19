import { useEffect, useState } from "react";

export default function Movies() {
    const [data, setData] = useState({});
    const [title, setTitle] = useState({});


    useEffect(() => {
        async function getData() {
            const received = await fetch(`https://api.themoviedb.org/3/search/movie?query=${title}`, {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization:
                        `Bearer ${process.env.REACT_APP_TOKEN}`,
                },
            });
    
            const response = await received.json();
            console.log(response);
            setData(response);
        }

        getData()

    }, [title])


    return(
        <div>
            <button onClick={() => {
                const body = document.querySelector("body");
                body.classList.toggle("dark");
                const button = document.querySelector("button");
                button.textContent = body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
            }}>
                Dark Mode
            </button>
            <h1>Busca de filmes?</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <input type="text" onChange={(e) => setTitle(e.target.value)} />
                <button>Pesquisar</button>
            </form>
            <div className="movie-container">
                {data.results?.map((item) => (
                    <div key={item.id}>
                        <h4 style={{ textAlign: "center", maxWidth: "300px" }}>
                            {item.title} ({new Date(item.release_date).getFullYear()})
                        </h4>
                        <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} width="300px" />
                    </div>
                ))}
            </div>
        </div>
    );
}

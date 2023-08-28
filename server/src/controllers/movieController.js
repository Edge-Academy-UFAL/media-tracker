const { redis } = require("../lib/cache");

async function getMovie(request, response) {
    try {
        const { id } = request.params;

        const cachedFilm = await redis.get(id);

        if (cachedFilm) {
            return response.json(JSON.parse(cachedFilm));
        }

        const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${process.env.TOKEN_TMDB_API}`,
            },
        };

        const fetchResponse = await fetch(url, options);
        const filmData = await fetchResponse.json();

        // console.log(filmData);

        await redis.set(id, JSON.stringify(filmData));

        return response.json(filmData); // Envia os dados da API como resposta
    } catch (err) {
        response.status(500).send(err);
    }
}

module.exports = {
    getMovie,
};

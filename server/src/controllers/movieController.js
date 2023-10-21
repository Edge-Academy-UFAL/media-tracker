const { redis } = require("../lib/cache");

async function getMovie(request, response) {
    try {
        const { id } = request.params;
        if (!id) return response.status(400).send({ error: "Missing required information" });

        const cachedMovie = await redis.get(id);

        if (cachedMovie) {
            return response.json(JSON.parse(cachedMovie));
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
        const movieData = await fetchResponse.json();

        // TODO: add only the data we need, both to the cache and to the response

        movieData.year = movieData.release_date.split("-")[0] || "Unknown";
        movieData.runtime = movieData.runtime > 60 ? `${Math.floor(movieData.runtime / 60)}h ${movieData.runtime % 60}m` : `${movieData.runtime}m` || "Unknown";
        console.warn(movieData.production_companies);
        movieData.production = movieData.production_companies[0] || "Unknown";
        movieData.emptyStars = Array(5 - Math.ceil(movieData.vote_average / 2)).fill(0);
        movieData.fullStars = Array(Math.floor(movieData.vote_average / 2)).fill(0);
        movieData.hasHalfStar = movieData.vote_average % 2 !== 0;
        movieData.genres = movieData.genres.slice(0, 4);

        await redis.set(id, JSON.stringify(movieData));

        return response.json(movieData);
    } catch (err) {
        response.status(500).send(err);
    }
}

module.exports = {
    getMovie,
};

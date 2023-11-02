const { PrismaClient } = require("@prisma/client");
const { redis } = require("../lib/cache");

const prisma = new PrismaClient();

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

        const movie = {
            id: movieData.id,
            title: movieData.title,
            overview: movieData.overview,
            poster_path: movieData.poster_path,
            genres: movieData.genres ? (movieData.genres.length > 4 ? movieData.genres.slice(0, 4) : movieData.genres) : [],
            year: movieData.release_date ? movieData.release_date.split("-")[0] : "Unknown",
            runtime: movieData.runtime > 60 ? `${Math.floor(movieData.runtime / 60)}h ${movieData.runtime % 60}m` : `${movieData.runtime}m` || "Unknown",
            production: movieData.production_companies ? (movieData.production_companies.length > 0 ? movieData.production_companies[0].name : "Unknown") : "Unknown",
            emptyStars: movieData.vote_average ? Array(5 - Math.ceil(movieData.vote_average / 2)).fill(0) : Array(5).fill(0),
            fullStars: movieData.vote_average ? Array(Math.floor(movieData.vote_average / 2)).fill(0) : Array(0).fill(0),
            hasHalfStar: movieData.vote_average ? movieData.vote_average % 2 !== 0 : false,
        }

        await redis.set(id, JSON.stringify(movie));

        return response.json(movie);
    } catch (err) {
        console.log(err);
        response.status(500).send(err);
    }
}

async function rateMovie(request, response){
    try{
        const {userId, tmdbId} = request.params
        const { note } = request.body

        const movieRate = await prisma.movie.update({
            where: {
                userId,
                tmdbId
            },
            data:{
                rating: note
            }
        })
        
        return response.send(movieRate)

    }catch(err){
        return response.status(500).send(err)
    }
}


module.exports = {
    getMovie,
    rateMovie
};

const { PrismaClient } = require("@prisma/client");
const { redis } = require("../lib/cache");
const prisma = new PrismaClient();

async function getFilms(request, response) {
  try {
    const films = await prisma.filme.findMany();
    response.status(200).send(films);
  } catch (err) {
    response.status(500).send({ error: "Internal server error" });
  }
}

async function createFilm(request, response) {
  const {
    tmdbId,
    original_title,
    overview,
    popularity,
    poster_path,
    release_date,
    vote_average,
    vote_count,
  } = request.body;
  try {
    const newFilm = await prisma.filme.create({
      data: {
        tmdbId,
        original_title,
        overview,
        popularity,
        poster_path,
        release_date,
        vote_average,
        vote_count,
      },
    });
    response.status(201).send(newFilm);
  } catch (err) {
    response.status(500).send({ error: "Internal server error" });
  }
}

async function getFilme(request, response) {
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
  getFilms,
  createFilm,
  getFilme,
};

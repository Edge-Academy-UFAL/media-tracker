const { redis } = require('../lib/cache');

async function getMovie(request, response) {
  const { id } = request.params;
  try {
    if (!id) return response.status(400).send({ error: 'Missing required information' });

    const cachedMovie = await redis.get(id);

    if (cachedMovie) {
      return response.json(JSON.parse(cachedMovie));
    }

    const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TOKEN_TMDB_API}`,
      },
    };

    const fetchResponse = await fetch(url, options);
    const movieData = await fetchResponse.json();

    await redis.set(id, JSON.stringify(movieData));

    return response.json(movieData);
  } catch (err) {
    response.status(500).send(err);
  }
}

module.exports = {
  getMovie,
};

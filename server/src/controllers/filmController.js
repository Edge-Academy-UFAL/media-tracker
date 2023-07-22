const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');

async function getFilms(request, response) {
  try {
    const films = await prisma.filme.findMany();
    response.status(200).send(films);
  } catch (err) {
    response.status(500).send({ error: 'Internal server error' });
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
    response.status(500).send({ error: 'Internal server error' });
  }
}

module.exports = {
  getFilms,
  createFilm,
};

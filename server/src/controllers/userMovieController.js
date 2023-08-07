const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");

async function getFilms(request, response) {
  try {
    const films = await prisma.userMovie.findMany();
    response.status(200).send(films);
  } catch (err) {
    response.status(500).send({ error: "Internal server error" });
  }
}

async function createFilm(request, response) {
  const { situacao, avaliacao, local_assistido, usuarioId, filmeId } =
    request.body;
  try {
    const film = await prisma.userMovie.create({
      data: {
        situacao,
        avaliacao,
        local_assistido,
        usuarioId,
        filmeId,
      },
    });
    response.status(201).send(film);
  } catch (err) {
    response.status(500).send({ error: "Internal server error" });
  }
}

async function updateFilm(request, response) {
  try {
    const { userId, movieId } = request.params;

    const { situacao } = request.body;

    const film = await prisma.userMovie.updateMany({
      where: {
        usuarioId: userId,
        filmeId: movieId,
      },
      data: {
        situacao,
      },
    });

    return response.status(200).send(film);
  } catch (err) {
    return response.status(500).send(err);
  }
}

module.exports = {
  getFilms,
  createFilm,
  updateFilm,
};

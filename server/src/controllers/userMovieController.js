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

module.exports = {
  getFilms,
  createFilm,
};

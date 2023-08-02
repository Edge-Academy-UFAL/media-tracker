const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");

async function getUsers(request, response) {
  try {
    const users = await prisma.usuario.findMany();
    response.status(200).send(users);
  } catch (err) {
    response.status(500).send({ err });
  }
}

async function createUser(request, response) {
  const { email, nome, senha } = request.body;
  try {
    const newUser = await prisma.usuario.create({
      data: {
        email,
        nome,
        senha,
      },
    });
    response.status(201).send(newUser);
  } catch (err) {
    response.status(500).send({ error: err });
  }
}

async function loginUser(request, response) {
  const { email, senha } = request.body;
  try {
    const user = await prisma.usuario.findUnique({
      where: {
        email,
        senha,
      },
    });

    response.status(201).send(user);
  } catch (err) {
    response.status(500).send({ error: err });
  }
}

async function getMoviesByIdUser(request, response) {
  const { userId } = request.params;
  try {
    const user = await prisma.userMovie.findMany({
      where: {
        usuarioId: userId,
      },
    });

    var movies = [];

    for (let i = 0; i < user.length; i++) {
      const movie = await prisma.filme.findUnique({
        where: {
          id: user[i].filmeId,
        },
      });

      movie["situacao"] = user[i].situacao;
      movie["avaliacao"] = user[i].avaliacao;
      movie["local_assistido"] = user[i].local_assistido;

      movies.push(movie);
    }

    response.status(201).send(movies);
  } catch (err) {
    response.status(500).send({ error: err });
  }
}

module.exports = {
  getUsers,
  createUser,
  loginUser,
  getMoviesByIdUser,
};

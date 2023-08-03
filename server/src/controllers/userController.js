const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');

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
  if (!email || !nome || !senha)
    return response.status(400).send({ error: 'Email, nome e senha são obrigatórios' });

  const foundUser = await prisma.usuario.findUnique({
    where: {
      email,
    },
  });
  if (foundUser) return response.status(400).send({ error: 'Email já cadastrado' });
  try {
    const hash = await bcrypt.hash(senha, 10);
    const newUser = await prisma.usuario.create({
      data: {
        email,
        nome,
        senha: hash,
      },
    });
    response.status(201).send(newUser);
  } catch (err) {
    response.status(500).send({ error: err });
  }
}

async function loginUser(request, response) {
  const { email, senha } = request.body;
  if (!email || !senha)
    return response.status(400).send({ error: 'Email e senha são obrigatórios' });
  const foundUser = await prisma.usuario.findUnique({
    where: {
      email,
    },
  });
  if (!foundUser) return response.status(400).send({ error: 'Usuário não encontrado' });
  const match = await bcrypt.compare(senha, foundUser.senha);
  if (!match) return response.status(400).send({ error: 'Email ou senha não conferem!' });
  const jwtToken = jwt.sign(
    { id: foundUser.id, email: foundUser.email, nome: foundUser.nome },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );
  response.json({ token: jwtToken });
}

async function getUserByEmail(request, response) {
  const  email = request.params.userEmail;
  try {
    const user = await prisma.usuario.findUnique({
      where: {
        email,
      },
    });
    response.status(201).send({ id: user.id, email: user.email, nome: user.nome });
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

      movie['situacao'] = user[i].situacao;
      movie['avaliacao'] = user[i].avaliacao;
      movie['local_assistido'] = user[i].local_assistido;

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
  getUserByEmail,
};

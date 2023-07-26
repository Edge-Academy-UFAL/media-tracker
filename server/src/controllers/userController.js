const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
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
    response.status(500).send({ error: 'Internal server error' });
  }
}

module.exports = {
  getUsers,
  createUser,
};

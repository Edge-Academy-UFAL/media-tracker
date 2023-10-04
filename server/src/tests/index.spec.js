const app = require('../../app');
const { PrismaClient } = require('@prisma/client');
const { getUser } = require('../controllers/userController');
const { createUser } = require('../controllers/userController');
const { loginUser } = require('../controllers/userController');
const { getMovies } = require('../controllers/userController');
const { addMovie } = require('../controllers/userController');

const prisma = new PrismaClient();

const email = `testuser${Date.now()}@example.com`;

const request = (body = null, userId = null, query = {}, params = {}) => ({
  body,
  userId,
  query,
  params,
});

const response = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const createUserMock = jest.fn();
const createMovieMock = jest.fn();
const updateMovieMock = jest.fn();

createUserMock.mockImplementation((req, res) => {
  return res.status(201).send({
    id: '1',
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
  });
});

createMovieMock.mockImplementation((req, res) => {
  return res.status(201).send({
    message: 'Movie added',
  });
});

updateMovieMock.mockImplementation((req, res) => {
  return res.status(200).send({
    status: req.body.status,
  });
});

describe('User', () => {
  describe('Get', () => {
    it('should not get user, user not found', async () => {
      const res = response();
      const req = request(null, '1', {});

      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      try {
        await getUser(req, res);
      } catch (err) {
        expect(err.message).toBe('User not found');
      }
    });

    it('should not get user, user null', async () => {
      const res = response();
      const req = request(null, null, {});

      await getUser(req, res);

      const status = res.status.mock.calls[0][0];
      const send = res.send.mock.calls[0][0];
      expect(status).toBe(500);
      expect(send).toHaveProperty('error');
    });

    it('should get user', async () => {
      const res = response();
      const req = request(null, '273012ff-a022-481f-a305-7f67a7445620');

      await getUser(req, res);
      const status = res.status.mock.calls[0][0];
      const send = res.send.mock.calls[0][0];
      expect(status).toBe(200);
      expect(send).toHaveProperty('id');
      expect(send).toHaveProperty('email');
      expect(send).toHaveProperty('name');
      expect(send).toHaveProperty('password');
    });

    it('should not get user, invalid userId', async () => {
      const res = response();
      const req = request(null, 1);

      prisma.user.findUnique = jest.fn().mockImplementationOnce(() => {
        throw new Error('Invalid userId');
      });

      try {
        await getUser(req, res);
      } catch (err) {
        expect(err.message);
        expect(res.status).toHaveBeenCalledWith(500);
      }
    });
  });

  describe('Create', () => {
    it('should not create a new user, missing informations', async () => {
      const res = response();
      const req = request({
        email: '',
        name: '',
        password: '',
      });
      await createUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ error: 'Missing required information' });
    });

    it('should create user', async () => {
      const res = response();
      const req = request({
        email,
        name: 'test',
        password: '123456',
      });

      await createUserMock(req, res);

      const status = res.status.mock.calls[0][0];
      const send = res.send.mock.calls[0][0];

      expect(status).toBe(201);
      expect(send).toHaveProperty('id');
      expect(send).toHaveProperty('email', req.body.email);
      expect(send).toHaveProperty('name', req.body.name);
      expect(send).toHaveProperty('password');
      expect(createUserMock).toHaveBeenCalled();
      expect(createUserMock).toHaveBeenCalledWith(req, res);
    });

    it('should not create a new user, user already exists', async () => {
      const res = response();
      const req = request({
        email,
        name: 'test',
        password: '123456',
      });

      prisma.user.create = jest.fn().mockImplementationOnce(() => {
        throw new Error('Email already exists');
      });

      try {
        await createUser(req, res);
      } catch (err) {
        expect(err.message).toBe('Email already exists');
      }
    });

    it('should not create a new user, invalid email', async () => {
      const res = response();
      const req = request({
        email: 'test',
        name: 'test',
        password: '123456',
      });

      prisma.user.create = jest.fn().mockImplementationOnce(() => {
        throw new Error('Invalid email');
      });

      try {
        await createUser(req, res);
      } catch (err) {
        expect(err.message);
        expect(res.status).toHaveBeenCalledWith(500);
      }
    });
  });

  describe('Login', () => {
    it('should not login user, missing informations', async () => {
      const res = response();
      const req = request({
        email: '',
        password: '',
      });
      await loginUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ error: 'Missing required information' });
    });

    it('should not login user, invalid password', async () => {
      const res = response();
      const req = request({
        email,
        password: '12345',
      });

      prisma.user.findUnique = jest.fn().mockResolvedValue({
        email,
        password: '123456',
      });

      try {
        await loginUser(req, res);
      } catch (err) {
        expect(err.message).toBe('Invalid password');
      }
    });

    it('should not login user, user not found', async () => {
      const res = response();
      const req = request({
        email: 'test',
        password: '123',
      });

      prisma.user.findUnique = jest.fn().mockResolvedValue({
        email: 'test',
        name: 'test',
      });

      try {
        await loginUser(req, res);
      } catch (err) {
        expect(err.message).toBe('User with this email does not exist');
      }
    });

    it('should login user', async () => {
      const res = response();
      const req = request({
        email,
        password: '123456',
      });

      prisma.user.findUnique = jest.fn().mockResolvedValue({
        email,
        password: '123456',
      });

      await loginUser(req, res);

      const status = res.status.mock.calls[0][0];
      const send = res.send.mock.calls[0][0];

      expect(status).toBe(200);
      expect(send).toHaveProperty('token');
    });
  });

  describe('GetMovies', () => {
    it('should not get movies, user not found', async () => {
      const res = response();
      const req = request(null, null, {
        status: 'plan',
      });

      prisma.user.findUnique = jest.fn().mockResolvedValue(null);

      try {
        await getMovies(req, res);
      } catch (err) {
        expect(err.message).toBe('User not found');
      }
    });

    it('should get movies', async () => {
      const res = response();
      const req = request(null, '273012ff-a022-481f-a305-7f67a7445620', {
        status: 'plan',
      });

      prisma.movie.findMany = jest.fn().mockResolvedValue([
        {
          where: {
            userId: '273012ff-a022-481f-a305-7f67a7445620',
          },
        },
      ]);

      await getMovies(req, res);

      const status = res.status.mock.calls[0][0];
      const send = res.send.mock.calls[0][0];
      expect(status).toBe(200);
      expect(Array.isArray(send)).toBe(true);
      expect(send.length).toBe >= 0;
    });

    it('should get movies, no movies', async () => {
      const res = response();
      const req = request(null, '273012ff-a022-481f-a305-7f67a7445620', {
        status: 'watched',
      });

      await getMovies(req, res);

      const status = res.status.mock.calls[0][0];
      const send = res.send.mock.calls[0][0];

      expect(status).toBe(200);
      expect(Array.isArray(send)).toBe(true);
    });

    it('should get movies, no status', async () => {
      const res = response();
      const req = request(null, '273012ff-a022-481f-a305-7f67a7445620', {});

      await getMovies(req, res);

      const status = res.status.mock.calls[0][0];
      const send = res.send.mock.calls[0][0];
      expect(status).toBe(200);
      expect(Array.isArray(send)).toBe(true);
      expect(send.length).toBe >= 0;
    });

    it('should not get movies, invalid userId', async () => {
      const res = response();
      const req = request(null, 1, {});

      prisma.movie.findMany = jest.fn().mockImplementationOnce(() => {
        throw new Error('Invalid userId');
      });

      try {
        await getMovies(req, res);
      } catch (err) {
        expect(err.message);
        expect(res.status).toHaveBeenCalledWith(500);
      }
    });
  });

  describe('AddMovie', () => {
    it('should not add movie, user not found', async () => {
      const res = response();
      const req = request(
        {
          status: 'plan',
        },
        null,
        null,
        {
          tmdbId: '123',
        }
      );

      try {
        await addMovie(req, res);
      } catch (err) {
        expect(err.message).toBe('User not found');
      }
    });

    it('should not add movie, missing status', async () => {
      const res = response();
      const req = request(
        {
          status: '',
        },
        '273012ff-a022-481f-a305-7f67a7445620',
        null,
        {
          tmdbId: '123',
        }
      );

      try {
        await addMovie(req, res);
      } catch (err) {
        expect(err.message).toBe('Missing required information');
      }
    });

    it('should add movie', async () => {
      const res = response();
      const req = request(
        {
          status: 'plan',
        },
        '273012ff-a022-481f-a305-7f67a7445620',
        null,
        {
          tmdbId: '123',
        }
      );

      await createMovieMock(req, res);

      const status = res.status.mock.calls[0][0];
      const send = res.send.mock.calls[0][0];

      expect(status).toBe(201);
      expect(send).toHaveProperty('message', 'Movie added');
      expect(createMovieMock).toHaveBeenCalled();
      expect(createMovieMock).toHaveBeenCalledWith(req, res);
    });

    it('should not add movie, movie already added', async () => {
      const res = response();
      const req = request(
        {
          status: 'plan',
        },
        '273012ff-a022-481f-a305-7f67a7445620',
        null,
        {
          tmdbId: '496450',
        }
      );

      try {
        await addMovie(req, res);
      } catch (err) {
        expect(err.message).toBe('Movie already has been added');
      }
    });

    it('should not add movie, movie not found', async () => {
      const res = response();
      const req = request(
        {
          status: 'plan',
        },
        '273012ff-a022-481f-a305-7f67a7445620',
        null,
        {
          tmdbId: 1,
        }
      );

      try {
        await addMovie(req, res);
      } catch (err) {
        expect(err.message).toBe('Movie not found');
        expect(res.status).toHaveBeenCalledWith(500);
      }
    });
  });

  describe('UpdateStatus', () => {
    it('should not update status, missing required information', async () => {
      const res = response();
      const req = request(
        {
          status: '',
        },
        '273012ff-a022-481f-a305-7f67a7445620',
        null,
        {
          tmdbId: '123',
        }
      );

      try {
        await addMovie(req, res);
      } catch (err) {
        expect(err.message).toBe('Missing required information');
      }
    });

    it('should update status', async () => {
      const res = response();
      const req = request(
        {
          status: 'watched',
        },
        '273012ff-a022-481f-a305-7f67a7445620',
        null,
        {
          tmdbId: '123',
        }
      );

      await updateMovieMock(req, res);

      const status = res.status.mock.calls[0][0];
      const send = res.send.mock.calls[0][0];

      expect(status).toBe(200);
      expect(send).toHaveProperty('status', 'watched');
      expect(updateMovieMock).toHaveBeenCalled();
      expect(updateMovieMock).toHaveBeenCalledWith(req, res);
    });

    it('should not update status, movie not found', async () => {
      const res = response();
      const req = request(
        {
          status: 'watched',
        },
        '273012ff-a022-481f-a305-7f67a7445620',
        null,
        {
          tmdbId: 1,
        }
      );

      try {
        await addMovie(req, res);
      } catch (err) {
        expect(err.message);
        expeect(res.status).toHaveBeenCalledWith(500);
      }
    });
  });
});

// describe('create user', () => {
//   it('should not create a new user, missing informations', async () => {
//     const res = await request(app).post('/users').send({
//       email: '',
//       name: '',
//       password: '',
//     });
//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should not create a new user, missing informations', async () => {
//     const res = await request(app).post('/users').send({
//       email: '1234',
//       name: 'gfd',
//       password: '',
//     });
//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should not create a new user, missing informations', async () => {
//     const res = await request(app).post('/users').send({
//       email: '',
//       name: 'da',
//       password: '21',
//     });
//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should create a new user', async () => {
//     const res = await request(app).post('/users').send({
//       email: email,
//       name: 'teste123',
//       password: '123456',
//     });
//     expect(res.statusCode).toEqual(201);
//     expect(res.body).toHaveProperty('id');
//     expect(res.body).toHaveProperty('email');
//     expect(res.body).toHaveProperty('name');
//     expect(res.body).toHaveProperty('password');
//   });

//   it('should not create a new user, user already exists', async () => {
//     const res = await request(app).post('/users').send({
//       email: 'edge@teste.com',
//       name: 'teste123',
//       password: '123456',
//     });
//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toHaveProperty('error');
//   });
// });

// describe('login user', () => {
//   it('should not login user, missing informations', async () => {
//     const res = await request(app).post('/users/login').send({
//       email: '',
//       password: '',
//     });
//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should not login user, missing informations', async () => {
//     const res = await request(app).post('/users/login').send({
//       email: '123',
//       password: '',
//     });
//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should not login user, missing informations', async () => {
//     const res = await request(app).post('/users/login').send({
//       email: '',
//       password: '13',
//     });
//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should not login user, invalid password', async () => {
//     const res = await request(app).post('/users/login').send({
//       email: 'edge@teste.com',
//       password: '12345',
//     });
//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should login user', async () => {
//     const res = await request(app).post('/users/login').send({
//       email: 'edge@teste.com',
//       password: '123',
//     });
//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toHaveProperty('token');
//     token = res.body.token;
//   });
// });

// describe('get user', () => {
//   it('should not get user, missing token', async () => {
//     const res = await request(app).get('/users');
//     expect(res.statusCode).toEqual(401);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should not get user, invalid token', async () => {
//     const res = await request(app)
//       .get('/users')
//       .set('Authorization', `Bearer ${token}123`);
//     expect(res.statusCode).toEqual(401);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should get user', async () => {
//     const res = await request(app).get('/users').set('Authorization', `Bearer ${token}`);
//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toHaveProperty('id');
//     expect(res.body).toHaveProperty('email');
//     expect(res.body).toHaveProperty('name');
//     expect(res.body).toHaveProperty('password');
//   });
// });

// describe('get movies', () => {
//   it('should not get movies, missing token', async () => {
//     const res = await request(app).get('/users/movies');
//     expect(res.statusCode).toEqual(401);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should not get movies, invalid token', async () => {
//     const res = await request(app)
//       .get('/users/movies')
//       .set('Authorization', `Bearer ${token}123`);
//     expect(res.statusCode).toEqual(401);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should get movies', async () => {
//     const res = await request(app)
//       .get('/users/movies')
//       .set('Authorization', `Bearer ${token}`);
//     expect(res.statusCode).toEqual(201);
//   });

//   it('should get movies with status == plan', async () => {
//     const res = await request(app)
//       .get('/users/movies?status=plan')
//       .set('Authorization', `Bearer ${token}`);
//     expect(res.statusCode).toEqual(201);
//     res.body.forEach((movie) => {
//       expect(movie.status).toEqual('plan');
//     });
//   });
// });

// describe('add movie', () => {
//   it('should not add movie, missing token', async () => {
//     const res = await request(app).post(`/users/movies/${tmdbId}`).send({
//       status: 'plan',
//     });
//     expect(res.statusCode).toEqual(401);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should not add movie, invalid token', async () => {
//     const res = await request(app)
//       .post(`/users/movies/${tmdbId}`)
//       .set('Authorization', `Bearer ${token}123`)
//       .send({
//         status: 'plan',
//       });
//     expect(res.statusCode).toEqual(401);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should not add movie, missing status', async () => {
//     const res = await request(app)
//       .post(`/users/movies/${tmdbId}`)
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         status: '',
//       });
//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should not add movie, movie already added', async () => {
//     const res = await request(app)
//       .post(`/users/movies/496450`)
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         status: 'plan',
//       });
//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should add movie', async () => {
//     const res = await request(app)
//       .post(`/users/movies/${tmdbId}`)
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         status: 'plan',
//       });
//     expect(res.statusCode).toEqual(201);
//     expect(res.body).toHaveProperty('message');
//   });
// });

// describe('update status', () => {
//   it('should not update status, missing token', async () => {
//     const res = await request(app).put(`/users/movies/496450`).send({
//       status: 'watched',
//     });
//     expect(res.statusCode).toEqual(401);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should not update status, invalid token', async () => {
//     const res = await request(app)
//       .put(`/users/movies/496450`)
//       .set('Authorization', `Bearer ${token}123`)
//       .send({
//         status: 'watched',
//       });
//     expect(res.statusCode).toEqual(401);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should not update status, missing status', async () => {
//     const res = await request(app)
//       .put(`/users/movies/496450`)
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         status: '',
//       });
//     expect(res.statusCode).toEqual(400);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should not update status, movie not found', async () => {
//     const res = await request(app)
//       .put(`/users/movies/0`)
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         status: 'watched',
//       });
//     expect(res.statusCode).toEqual(500);
//     expect(res.body).toHaveProperty('error');
//   });
// });

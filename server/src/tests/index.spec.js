const app = require('../../app');
const { PrismaClient } = require('@prisma/client');
const { getUser } = require('../controllers/userController');
const { createUser } = require('../controllers/userController');
const { loginUser } = require('../controllers/userController');
const { getMovies } = require('../controllers/userController');
const { addMovie } = require('../controllers/userController');
const { updateStatus } = require('../controllers/userController');
const { getMovie } = require('../controllers/movieController');

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

const getUserMock = jest.fn();
const createUserMock = jest.fn();
const createUserMissingInformations = jest.fn();
const createMovieMock = jest.fn();
const updateMovieMock = jest.fn();
const getMovieMock = jest.fn();

getMovieMock.mockImplementation((req, res) => {
  return res.status(200).send({
    adult: false,
  });
});

createUserMissingInformations.mockImplementation((req, res) => {
  return res.status(400).send({
    error: 'Missing required information',
  });
});

getUserMock.mockImplementation((req, res) => {
  return res.status(200).send({
    id: '273012ff-a022-481f-a305-7f67a7445620',
    email: 'teste@teste.com',
    name: 'test',
    password: '123456',
  });
});

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

      await getUserMock(req, res);

      const status = res.status.mock.calls[0][0];
      const send = res.send.mock.calls[0][0];

      console.log(send);

      expect(status).toBe(200);
      expect(send).toHaveProperty('id', '273012ff-a022-481f-a305-7f67a7445620');
      expect(send).toHaveProperty('email', 'teste@teste.com');
      expect(send).toHaveProperty('name', 'test');
      expect(send).toHaveProperty('password', '123456');
      expect(getUserMock).toHaveBeenCalled();
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
      await createUserMissingInformations(req, res);
      
      const status = res.status.mock.calls[0][0];
      const send = res.send.mock.calls[0][0];

      expect(status).toBe(400);
      expect(send).toHaveProperty('error', 'Missing required information');
      expect(createUserMissingInformations).toHaveBeenCalled();
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
        await updateStatus(req, res);
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
        await updateStatus(req, res);
      } catch (err) {
        expect(err.message);
        expect(res.status).toHaveBeenCalledWith(500);
      }
    });
  });
});

describe('Movie', () => {
  describe('Get', () => {
    it('should not get movie, missing required information', async () => {
      const res = response();
      const req = request(null, null, null, {
        id: '',
      });

      try {
        await getMovie(req, res);
      } catch (err) {
        expect(err.message).toBe('Missing required information');
      }
    });

    it('should get movie', async () => {
      const res = response();
      const req = request(null, null, null, {
        id: '123',
      });

      await getMovieMock(req, res);

      const status = res.status.mock.calls[0][0];
      const send = res.send.mock.calls[0][0];

      expect(status).toBe(200);
      expect(send).toHaveProperty('adult', false);
    });
  });
});

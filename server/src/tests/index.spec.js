const request = require('supertest');
const app = require('../../app');
const { get } = require('../routes/userRoute');

let token = '';
const email = `testuser${Date.now()}@example.com`;
// variavel tmdb com numeros entre 1 e 800000
const tmdbId = Math.floor(Math.random() * 800000) + 1;

describe('create user', () => {
  it('should not create a new user, missing informations', async () => {
    const res = await request(app).post('/users').send({
      email: '',
      name: '',
      password: '',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not create a new user, missing informations', async () => {
    const res = await request(app).post('/users').send({
      email: '1234',
      name: 'gfd',
      password: '',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not create a new user, missing informations', async () => {
    const res = await request(app).post('/users').send({
      email: '',
      name: 'da',
      password: '21',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should create a new user', async () => {
    const res = await request(app).post('/users').send({
      email: email,
      name: 'teste123',
      password: '123456',
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('password');
  });

  it('should not create a new user, user already exists', async () => {
    const res = await request(app).post('/users').send({
      email: 'edge@teste.com',
      name: 'teste123',
      password: '123456',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('login user', () => {
  it('should not login user, missing informations', async () => {
    const res = await request(app).post('/users/login').send({
      email: '',
      password: '',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not login user, missing informations', async () => {
    const res = await request(app).post('/users/login').send({
      email: '123',
      password: '',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not login user, missing informations', async () => {
    const res = await request(app).post('/users/login').send({
      email: '',
      password: '13',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not login user, invalid password', async () => {
    const res = await request(app).post('/users/login').send({
      email: 'edge@teste.com',
      password: '12345',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should login user', async () => {
    const res = await request(app).post('/users/login').send({
      email: 'edge@teste.com',
      password: '123',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });
});

describe('get user', () => {
  it('should not get user, missing token', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should not get user, invalid token', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}123`);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should get user', async () => {
    const res = await request(app).get('/users').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('password');
  });
});

describe('get movies', () => {
  it('should not get movies, missing token', async () => {
    const res = await request(app).get('/users/movies');
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should not get movies, invalid token', async () => {
    const res = await request(app)
      .get('/users/movies')
      .set('Authorization', `Bearer ${token}123`);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should get movies', async () => {
    const res = await request(app)
      .get('/users/movies')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(201);
  });

  it('should get movies with status == plan', async () => {
    const res = await request(app)
      .get('/users/movies?status=plan')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(201);
    res.body.forEach((movie) => {
      expect(movie.status).toEqual('plan');
    });
  });
});

describe('add movie', () => {
  it('should not add movie, missing token', async () => {
    const res = await request(app).post(`/users/movies/${tmdbId}`).send({
      status: 'plan',
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should not add movie, invalid token', async () => {
    const res = await request(app)
      .post(`/users/movies/${tmdbId}`)
      .set('Authorization', `Bearer ${token}123`)
      .send({
        status: 'plan',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should not add movie, missing status', async () => {
    const res = await request(app)
      .post(`/users/movies/${tmdbId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: '',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not add movie, movie already added', async () => {
    const res = await request(app)
      .post(`/users/movies/496450`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'plan',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should add movie', async () => {
    const res = await request(app)
      .post(`/users/movies/${tmdbId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'plan',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message');
  });
});

describe('update status', () => {
  it('should not update status, missing token', async () => {
    const res = await request(app).put(`/users/movies/496450`).send({
      status: 'watched',
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should not update status, invalid token', async () => {
    const res = await request(app)
      .put(`/users/movies/496450`)
      .set('Authorization', `Bearer ${token}123`)
      .send({
        status: 'watched',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should not update status, missing status', async () => {
    const res = await request(app)
      .put(`/users/movies/496450`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: '',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not update status, movie not found', async () => {
    const res = await request(app)
      .put(`/users/movies/0`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'watched',
      });
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error');
  });

//   it('should update status', async () => {
//     const res = await request(app)
//       .put(`/users/movies/496450`)
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         status: 'watched',
//       });
//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toHaveProperty('id');
//   });
});
const request = require("supertest");
const app = require("../../app");

let token = '';

describe('create user', () => {
    it('should not create a new user, missing informations', async () => {
        const res = await request(app).post('/users').send({
            email: '',
            name: '',
            password: ''
        })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('error')
    })

    it('should not create a new user, missing informations', async () => {
        const res = await request(app).post('/users').send({
            email: '1234',
            name: 'gfd',
            password: ''
        })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('error')
    })

    it('should not create a new user, missing informations', async () => {
        const res = await request(app).post('/users').send({
            email: '',
            name: 'da',
            password: '21'
        })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('error')
    })

    it('should create a new user', async () => {
        const res = await request(app).post('/users').send({
            email: email,
            name: 'teste123',
            password: '123456'
        })
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('email')
        expect(res.body).toHaveProperty('name')
        expect(res.body).toHaveProperty('password')
    })  
    
    it('should not create a new user, user already exists', async () => {
        const res = await request(app).post('/users').send({
            email: email,
            name: 'teste123',
            password: '123456'
        })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('error')
    })
})

describe('login user', () => {
    it('should not login user, missing informations', async () => {
        const res = await request(app).post('/users/login').send({
            email: '',
            password: ''
        })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('error')
    })

    it('should not login user, missing informations', async () => {
        const res = await request(app).post('/users/login').send({
            email: '123',
            password: ''
        })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('error')
    })

    it('should not login user, missing informations', async () => {
        const res = await request(app).post('/users/login').send({
            email: '',
            password: '13'
        })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('error')
    })

    it('should not login user, invalid password', async () => {
        const res = await request(app).post('/users/login').send({
            email: email,
            password: '12345'
        })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('error')
    })

    it('should login user', async () => {
        const res = await request(app).post('/users/login').send({
            email: email,
            password: '123456'
        })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('token')
        token = res.body.token
    })
})
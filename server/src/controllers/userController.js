const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function getUser(request, response) {
    const userId = request.userId;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) return response.status(404).send({ error: "User not found" });

        response.status(200).send(user);
    } catch (err) {
        response.status(500).send({ error: err });
    }
}

async function createUser(request, response) {
    
    try {
        const { email, name, password } = request.body;
        
        const hash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hash,
            },
        });

        return response.status(201).send({error: false});

    } catch (err) {

        return response.status(500).send({ error: true });
    }
}

async function loginUser(request, response) {
    const { email, password } = request.body;

    if (!email || !password) return response.status(400).send({ error: "Missing required information" });

    const foundUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!foundUser) return response.status(400).send({ error: "User with this email does not exist" });

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) return response.status(400).send({ error: "Invalid password" });

    const jwtToken = jwt.sign({ id: foundUser.id, email: foundUser.email, name: foundUser.name }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    response.status(200).send({ token: jwtToken });
}

async function getMovies(request, response) {
    const userId = request.userId;
    const status = request.query.status;

    try {
        if (!status) {
            const movies = await prisma.movie.findMany({
                where: {
                    userId,
                },
            });
            return response.status(200).send(movies);
        }

        const movies = await prisma.movie.findMany({
            where: {
                userId,
                status,
            },
        });

        response.status(200).send(movies);
    } catch (err) {
        response.status(500).send({ error: err });
    }
}

async function getMovie(request, response) {
    const userId = request.userId;
    const { tmdbId } = request.params;

    try {
        const movie = await prisma.movie.findFirst({
            where: {
                userId,
                tmdbId,
            },
        });
        return response.status(200).send(movie);
    } catch (err) {
        console.log(err);
        response.status(500).send({ error: err });
    }
}

async function addMovie(request, response) {
    const { status } = request.body;
    const userId = request.userId;
    const { tmdbId } = request.params;

    try {
        if (!status) return response.status(400).send({ error: "Missing required information" });

        const foundMovie = await prisma.movie.findFirst({
            where: {
                tmdbId,
                userId,
            },
        });

        if (foundMovie) return response.status(400).send({ error: "Movie already has been added" });

        await prisma.movie.create({
            data: {
                tmdbId,
                status,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });

        response.status(201).send({ message: "Movie added" });
    } catch (err) {
        response.status(500).send({ error: "Internal server error" });
    }
}

async function deleteMovie(request, response) {
    const userId = request.userId;
    const { movieId } = request.params;

    if (!movieId) return response.status(400).send({ error: "Missing required information" });

    try {
        await prisma.movie.delete({
            where: {
                id: movieId,
                userId,
            },
        });

        response.status(200).send({ message: "Movie deleted" });
    } catch (err) {
        console.log(err);
        response.status(500).send({ error: err });
    }
}

async function updateStatus(request, response) {
    const userId = request.userId;
    const { status, rating } = request.body;
    const { movieId } = request.params;

    if (!status && !rating) return response.status(400).send({ error: "Missing required information" });

    try {
        const movie = await prisma.movie.update({
            where: {
                id: movieId,
                userId,
            },
            data: {
                status,
                rating,
            },
        });

        return response.status(200).send(movie);
    } catch (err) {
        console.log(err);

        return response.status(500).send({ error: err });
    }
}

module.exports = {
    getUser,
    createUser,
    loginUser,
    getMovies,
    getMovie,
    addMovie,
    updateStatus,
    deleteMovie,
};

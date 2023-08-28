const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

async function loginRequired(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({ error: "Login is required." });
    }

    const [, token] = authorization.split(" ");

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const { id, email, name } = payload;

        const user = await prisma.user.findUnique({
            where: {
                id,
                email,
                name,
            },
        });

        if (!user) {
            return res.status(401).send({ error: "User not found." });
        }

        req.userId = id;
        req.name = name;

        return next();
    } catch (e) {
        return res.status(401).send({ error: e });
    }
}

module.exports = loginRequired;

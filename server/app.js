const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

const whiteList = ["http://localhost:3000", "https://media-tracker-iota.vercel.app"];

const corsOptions = {
    origin(origin, callback) {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(cors(corsOptions));

// app.use((request, response, next) => {
//     response.header("Access-Control-Allow-Origin", "*");
//     response.header("Access-Control-Allow-Methods", "*");
//     response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

const userRoute = require("./src/routes/userRoute");
const movieRoute = require("./src/routes/movieRoute");

app.use("/users", userRoute);
app.use("/movies", movieRoute);
// / have a hello world route
app.get("/", (request, response) => {
    response.send("Hello World");
});

module.exports = app;
const express = require("express");
const userMovieController = require("../controllers/userMovieController");

const router = express.Router();

router.get("/", userMovieController.getFilms);
router.post("/", userMovieController.createFilm);
router.put("/:userId/:movieId", userMovieController.updateFilm);

module.exports = router;

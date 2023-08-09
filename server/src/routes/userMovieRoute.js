const express = require("express");
const userMovieController = require("../controllers/userMovieController");

const router = express.Router();

router.get("/", userMovieController.getFilms);
router.post("/", userMovieController.createFilm);
router.put("/:userId/:movieId", userMovieController.updateFilm);
router.get("/:userId/:status", userMovieController.getMovieByStatus);

module.exports = router;

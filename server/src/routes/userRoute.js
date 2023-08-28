const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/movies", userController.getMovies);
router.post("/movies", userController.addMovie);
router.put("/movies/:movieId", userController.updateStatus);
router.get("/movies", userController.getMovieByStatus);

module.exports = router;

    getMovieByStatus,

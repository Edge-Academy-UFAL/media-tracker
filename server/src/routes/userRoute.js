const express = require("express");
const userController = require("../controllers/userController");
const loginRequired = require("../middlewares/loginRequired");

const router = express.Router();

router.get("/", loginRequired, userController.getUser);
router.post("/", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/movies", loginRequired, userController.getMovies);
router.get("/movies/:tmdbId", loginRequired, userController.getMovie);
router.post("/movies/:tmdbId", loginRequired, userController.addMovie);
router.delete("/movies/:movieId", loginRequired, userController.deleteMovie);
router.put("/movies/:movieId", loginRequired, userController.updateStatus);

module.exports = router;

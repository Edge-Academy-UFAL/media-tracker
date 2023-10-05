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
router.put("/movies/:tmdbId", loginRequired, userController.updateStatus);

module.exports = router;

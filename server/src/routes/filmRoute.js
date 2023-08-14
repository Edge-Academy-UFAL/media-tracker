const express = require("express");
const filmController = require("../controllers/filmController");

const router = express.Router();

router.get("/", filmController.getFilms);
router.post("/", filmController.createFilm);
router.get("/:title", filmController.getFilme);

module.exports = router;

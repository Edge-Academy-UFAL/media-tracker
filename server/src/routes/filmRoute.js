const express = require("express");
const filmController = require("../controllers/filmController");

const router = express.Router();

router.get("/", filmController.getFilms);
router.post("/", filmController.createFilm);
router.get("/searchById/:id", filmController.getFilme);

module.exports = router;

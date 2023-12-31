const express = require("express");
const movieController = require("../controllers/movieController");
const loginRequired = require("../middlewares/loginRequired");

const router = express.Router();

router.get("/searchById/:id", loginRequired, movieController.getMovie);

module.exports = router;

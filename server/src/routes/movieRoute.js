const express = require("express");
const movieController = require("../controllers/movieController");

const router = express.Router();

router.get("/searchById/:id", movieController.getMovie);

module.exports = router;

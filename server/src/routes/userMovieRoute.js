const express = require('express');
const userMovieController = require('../controllers/userMovieController');

const router = express.Router();

router.get('/', userMovieController.getFilms);
router.post('/', userMovieController.createFilm);

module.exports = router;

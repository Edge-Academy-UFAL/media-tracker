const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/userInfo/:userEmail', userController.getUserByEmail);
router.get('/getMovies/:userId', userController.getMoviesByIdUser);

module.exports = router;

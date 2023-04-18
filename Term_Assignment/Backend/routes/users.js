const express = require("express");
const users_router = express.Router();

const users_controller = require('../controller/usersController');

users_router.post('/register', users_controller.post_add_user);
users_router.get('/checkEmail/:email', users_controller.get_check_email);
users_router.post('/validateUser', users_controller.post_validateUser);

module.exports = users_router;
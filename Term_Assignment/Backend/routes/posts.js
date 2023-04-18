const express = require("express");
const posts_router = express.Router();
const multer = require('multer');
const upload = multer({});

const posts_controller = require('../controller/postsController');

posts_router.get('/', posts_controller.get_all_posts);
posts_router.post('/addPost', upload.single('image'), posts_controller.post_add_post);
posts_router.get('/postDetails/:post_id', posts_controller.get_post_details);

module.exports = posts_router;
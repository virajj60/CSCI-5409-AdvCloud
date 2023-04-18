// Import required packages and files
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { connectToDatabase } = require('./dynamoDb/conn');

// Set up middleware
app.use(bodyParser.json());
app.use(cors());

//connect to dynamoDB 
const client = connectToDatabase();

// Set up routes
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
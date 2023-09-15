const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve mentor images as static files from the 'public' directory.
app.use('/public', express.static('public'));

// Define your API routes
const mentorsRouter = require('./routes/mentors');
app.use('/api/mentors', mentorsRouter);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
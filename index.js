const express = require('express')
const mongoose = require('mongoose')
const compression = require('compression')
require("dotenv").config();

const jobListing = require('./routes/jobListing')

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(compression({
  level: 6,
  threshold: 0
}))

mongoose
  .connect(
    process.env.DB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.log(err));

app.use('/api/listings', jobListing)

const port = process.env.PORT || 7000;

app.listen(port,  () => {
    console.log('Server running on port ' + port)

})